import { WebSocket, WebSocketServer } from 'ws';
import { main } from "./redisClient.js";
const wss = new WebSocketServer({ port: 8080 });
const { publishClient, subscribeClient } = await main();
//in-memory object holding all connected user
const subscriptions = {};
wss.on("connection", (usersocket) => {
    const id = generateId();
    subscriptions[id] = {
        ws: usersocket,
        senderId: "",
        rooms: [],
    };
    usersocket.on("message", (data) => {
        const parsedMessage = JSON.parse(data);
        console.log("received message:", parsedMessage);
        if (parsedMessage.type === "subscribe") {
            if (subscriptions[id]) {
                subscriptions[id].rooms.push(parsedMessage.roomId);
                subscriptions[id].senderId = parsedMessage.senderId.toString();
            }
            if (onfisrtSubscribedUser(parsedMessage.roomId)) {
                console.log("user subscribed to the room :", parsedMessage.roomId);
                subscribeClient.subscribe(parsedMessage.roomId, (message) => {
                    const parseMessage = JSON.parse(message); //because the message from redis is a string;
                    Object.keys(subscriptions).forEach((userId) => {
                        const user = subscriptions[userId];
                        const senderId = user?.senderId;
                        if (user && user.rooms.includes(parseMessage.roomId)) {
                            // skip the sender and send message to every body  who connect to the same room.
                            if (senderId !== parseMessage.senderId.toString()) {
                                user.ws.send(parseMessage.message);
                            }
                        }
                    });
                });
            }
        }
        if (parsedMessage.type === "typing") {
            // Broadcast typing status to all users in the same room except the sender
            Object.values(subscriptions).forEach((user) => {
                if (user.rooms.includes(parsedMessage.roomId) &&
                    user.senderId !== parsedMessage.senderId) {
                    user.ws.send(JSON.stringify({
                        type: "typing",
                        senderId: parsedMessage.senderId,
                        isTyping: parsedMessage.isTyping,
                    }));
                }
            });
        }
        if (parsedMessage.type === "unsubscribe") {
            const user = subscriptions[id];
            if (user) { //remove the user from the room
                user.rooms = user.rooms.filter(room => room != parsedMessage.roomId);
            }
            //now unsubscribe the user 
            if (onunsubscribigtheLastUser(parsedMessage.roomId)) {
                console.log("unsubscrbing the user from the with roomId:", parsedMessage.roomId);
                subscribeClient.unsubscribe(parsedMessage.roomId);
            }
        }
        //publishing the message;
        if (parsedMessage.type === "sendMessage") {
            const message = parsedMessage.message;
            const roomId = parsedMessage.roomId;
            const senderId = parsedMessage.senderId;
            publishClient.publish(roomId, JSON.stringify({
                type: "sendMessage",
                roomId: roomId,
                message,
                senderId,
            }));
        }
    });
});
const onfisrtSubscribedUser = (roomId) => {
    let count = 0;
    Object.keys(subscriptions).forEach(userId => {
        const user = subscriptions[userId];
        if (user && user.rooms.includes(roomId)) {
            count++;
        }
    });
    return count === 1;
};
const onunsubscribigtheLastUser = (roomId) => {
    let totalUser = 0;
    Object.keys(subscriptions).forEach(userId => {
        const user = subscriptions[userId];
        if (user && user.rooms.includes(roomId)) {
            totalUser++;
        }
    });
    return totalUser == 0; //return true only all the user subscribed to that room left;
};
const generateId = () => {
    return Math.random().toString(36).slice(2);
};
//# sourceMappingURL=index.js.map