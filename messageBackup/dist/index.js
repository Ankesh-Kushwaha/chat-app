import { createClient } from 'redis';
import dotenv from 'dotenv';
import connectToDataBase from './config.js';
import Room from './model/ChatMessageSchema.js';
const PORT = process.env.PORT;
import express from 'express';
const app = express();
dotenv.config();
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const BUFFER_LIMIT = 10;
const FLUSH_INTERVAL = 2000;
const messageBuffer = {};
const flushBuffer = async () => {
    const roomIds = Object.keys(messageBuffer);
    if (roomIds.length === 0)
        return;
    const bulkOps = [];
    for (const roomId of roomIds) {
        const messages = messageBuffer[roomId];
        if (messages?.length === 0)
            continue;
        bulkOps.push({
            updateOne: {
                filter: { roomId },
                update: { $push: { messages: { $each: messages } } },
                upsert: true,
            },
        });
        messageBuffer[roomId] = [];
    }
    if (bulkOps.length > 0) {
        try {
            await Room.bulkWrite(bulkOps);
            console.log(`Flushed ${bulkOps.length} room(s) of buffered messages to MongoDB.`);
        }
        catch (err) {
            console.error('Error flushing message buffer:', err);
        }
    }
};
setInterval(flushBuffer, FLUSH_INTERVAL);
const main = async () => {
    await connectToDataBase();
    const subscriber = createClient({ url: redisUrl });
    subscriber.on('error', (err) => console.error('Redis Client Error', err));
    await subscriber.connect();
    await subscriber.pSubscribe('*', async (message, channel) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.e === 'message') {
                const { roomId, message, senderId, userName, avatar, time } = parsedMessage;
                if (!messageBuffer[roomId]) {
                    messageBuffer[roomId] = [];
                }
                messageBuffer[roomId].push({ message, senderId, userName, avatar, time });
                // flush immediately if the buffer reaches the limit
                if (messageBuffer[roomId].length >= BUFFER_LIMIT) {
                    await flushBuffer();
                }
            }
        }
        catch (err) {
            console.error('Error buffering message:', err);
        }
    });
    console.log('Subscriber is listening and buffering messages...');
};
app.use("/", (req, res) => {
    res.status(200).json("server is fucking running");
});
app.listen(PORT, () => {
    main().catch(console.error);
    console.log('server is running on port:3000');
});
//# sourceMappingURL=index.js.map