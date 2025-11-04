import { createClient } from 'redis';
import dotenv from 'dotenv';
import connectToDataBase from './config.js';
import Room from './model/ChatMessageSchema.js';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const BUFFER_LIMIT = 10;       
const FLUSH_INTERVAL = 2000;   
interface ChatMessage {
  message: string;
  senderId: string;
  userName: string;
  avatar?: string;
  time: Date;
}


const messageBuffer: Record<string, ChatMessage[]> = {};

const flushBuffer = async () => {
  const roomIds = Object.keys(messageBuffer);
  if (roomIds.length === 0) return;

  const bulkOps = [];

  for (const roomId of roomIds) {
    const messages = messageBuffer[roomId];
    if (!messages?.length) continue;

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
      console.log(`💾 Flushed ${bulkOps.length} room(s) to MongoDB.`);
    } catch (err) {
      console.error('❌ Error flushing buffer:', err);
    }
  }
};


setInterval(flushBuffer, FLUSH_INTERVAL);

export const main = async () => {
  await connectToDataBase();

  const subscriber = createClient({ url: redisUrl });
  subscriber.on('error', (err) => console.error('Redis Error:', err));
  await subscriber.connect();

  console.log('🧠 Redis subscriber connected. Waiting for messages...');

  await subscriber.pSubscribe('*', async (message,channel) => {
    try {
      console.log("message:", message);
      const parsed = JSON.parse(message);

      if (parsed.e !== 'message') return;

      const { roomId, message: msg, senderId, userName, avatar, time } = parsed;

      if (!messageBuffer[roomId]) messageBuffer[roomId] = [];

      messageBuffer[roomId].push({ message: msg, senderId, userName, avatar, time });
      if (messageBuffer[roomId].length >= BUFFER_LIMIT) {
        await flushBuffer();
      }
    } catch (err) {
      console.error('❌ Error processing Redis message:', err);
    }
  });
};

main().catch((err) => console.error('Worker startup error:', err));
