import { WebSocketServer, WebSocket } from "ws";
import { main } from "../redisClient.js";
export class SignalingServer {
    static instance;
    wss;
    publishClient;
    subscribeClient;
    subscriptions = {};
    constructor(publishClient, subscribeClient) {
        this.publishClient = publishClient;
        this.subscribeClient = subscribeClient;
        this.wss = new WebSocketServer({ port: 8080 });
        console.log("[SignalingServer] Listening on ws://localhost:8080");
        this.listen();
    }
    // Singleton accessor
    static async getInstance() {
        if (!this.instance) {
            const { publishClient, subscribeClient } = await main();
            this.instance = new SignalingServer(publishClient, subscribeClient);
        }
        return this.instance;
    }
    /** WebSocket Connection Setup */
    listen() {
        this.wss.on("connection", (socket) => this.handleConnection(socket));
    }
    handleConnection(ws) {
        const id = this.generateId();
        this.subscriptions[id] = { ws, senderId: "", rooms: [] };
        console.log(`[WS] New connection (${id})`);
        ws.on("message", (data) => this.handleMessage(id, data.toString()));
        ws.on("close", () => this.handleClose(id));
    }
    /** Handle incoming messages from clients */
    handleMessage(id, rawData) {
        let parsed;
        try {
            parsed = JSON.parse(rawData);
        }
        catch {
            console.error("[SignalingServer] Invalid JSON:", rawData);
            return;
        }
        const event = parsed.data?.e;
        if (!event)
            return;
        switch (event) {
            case "subscribe":
                this.handleSubscribe(id, parsed.data);
                break;
            case "unsubscribe":
                this.handleUnsubscribe(id, parsed.data);
                break;
            case "typing":
                this.handleTyping(parsed.data);
                break;
            case "message":
                this.handlePublish(parsed.data);
                break;
            default:
                console.warn("[SignalingServer] Unknown event:", event);
        }
    }
    /** --- Handlers --- */
    handleSubscribe(id, data) {
        const { roomId, senderId } = data;
        const user = this.subscriptions[id];
        if (!user)
            return;
        user.rooms.push(roomId);
        user.senderId = senderId;
        if (this.isFirstSubscriber(roomId)) {
            console.log(`[Redis] Subscribing to channel: ${roomId}`);
            this.subscribeClient.subscribe(roomId, (message) => {
                const parsedMsg = JSON.parse(message);
                this.broadcast(roomId, parsedMsg, parsedMsg.senderId);
            });
        }
    }
    handleUnsubscribe(id, data) {
        const { roomId } = data;
        const user = this.subscriptions[id];
        if (!user)
            return;
        user.rooms = user.rooms.filter((r) => r !== roomId);
        if (this.isLastSubscriber(roomId)) {
            console.log(`[Redis] Unsubscribing from channel: ${roomId}`);
            this.subscribeClient.unsubscribe(roomId);
        }
    }
    handleTyping(data) {
        const { roomId, senderId, isTyping } = data;
        Object.values(this.subscriptions).forEach((user) => {
            if (user.rooms.includes(roomId) && user.senderId !== senderId) {
                user.ws.send(JSON.stringify({ e: "typing", senderId, isTyping }));
            }
        });
    }
    handlePublish(data) {
        const { roomId, message, senderId, userName, avatar } = data;
        this.publishClient.publish(roomId, JSON.stringify({
            e: "message",
            roomId,
            message,
            senderId,
            userName,
            avatar,
            time: new Date().toISOString(),
        }));
    }
    /** --- Utility Methods --- */
    handleClose(id) {
        const user = this.subscriptions[id];
        if (!user)
            return;
        user.rooms.forEach((roomId) => {
            if (this.isLastSubscriber(roomId)) {
                this.subscribeClient.unsubscribe(roomId);
            }
        });
        delete this.subscriptions[id];
        console.log(`[WS] Connection closed (${id})`);
    }
    broadcast(roomId, message, senderId) {
        Object.values(this.subscriptions).forEach((user) => {
            if (user.rooms.includes(roomId) && user.senderId !== senderId) {
                user.ws.send(JSON.stringify(message));
            }
        });
    }
    isFirstSubscriber(roomId) {
        return Object.values(this.subscriptions).filter((u) => u.rooms.includes(roomId)).length === 1;
    }
    isLastSubscriber(roomId) {
        return Object.values(this.subscriptions).filter((u) => u.rooms.includes(roomId)).length === 0;
    }
    generateId() {
        return Math.random().toString(36).substring(2);
    }
}
//# sourceMappingURL=wsmanager.js.map