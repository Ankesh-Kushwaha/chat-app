// ws/wsmanager.ts
import { WebSocketServer, WebSocket } from "ws";
import { main } from "../redisClient.js";
export class SignalingServer {
    static instance;
    wss;
    publishClient;
    subscribeClient;
    subscriptions = {};
    constructor(server, publishClient, subscribeClient) {
        this.publishClient = publishClient;
        this.subscribeClient = subscribeClient;
        // Attach WebSocket to existing HTTP server
        this.wss = new WebSocketServer({ server });
        console.log("[SignalingServer] WS attached to HTTP server");
        this.listen();
    }
    /** Singleton accessor */
    static async getInstance(server) {
        if (!this.instance) {
            const { publishClient, subscribeClient } = await main();
            if (!server)
                throw new Error("HTTP server is required for production WS");
            this.instance = new SignalingServer(server, publishClient, subscribeClient);
        }
        return this.instance;
    }
    /** WebSocket connection setup */
    listen() {
        this.wss.on("connection", (ws) => this.handleConnection(ws));
    }
    handleConnection(ws) {
        const id = this.generateId();
        this.subscriptions[id] = { ws, senderId: "", rooms: [] };
        console.log(`[WS] New connection (${id})`);
        ws.on("message", (data) => this.handleMessage(id, data.toString()));
        ws.on("close", () => this.handleClose(id));
        ws.on("error", (err) => console.error(`[WS] Error (${id}):`, err));
    }
    /** Handle incoming messages */
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
    /** Subscribe local user to a room and Redis channel */
    handleSubscribe(id, data) {
        const { roomId, senderId } = data;
        const user = this.subscriptions[id];
        if (!user)
            return;
        // Add room to local subscription
        if (!user.rooms.includes(roomId))
            user.rooms.push(roomId);
        user.senderId = senderId;
        // Always subscribe Redis to propagate messages for this room
        this.subscribeClient.subscribe(roomId, (message) => {
            const parsedMsg = JSON.parse(message);
            this.broadcastToLocalSockets(parsedMsg.roomId, parsedMsg.senderId, parsedMsg);
        });
    }
    handleUnsubscribe(id, data) {
        const { roomId } = data;
        const user = this.subscriptions[id];
        if (!user)
            return;
        user.rooms = user.rooms.filter((r) => r !== roomId);
        // Optional: Unsubscribe Redis if no local user in room
        const hasLocalUsers = Object.values(this.subscriptions).some((u) => u.rooms.includes(roomId));
        if (!hasLocalUsers)
            this.subscribeClient.unsubscribe(roomId);
    }
    /** Broadcast typing events to local users */
    handleTyping(data) {
        const { roomId, senderId, isTyping } = data;
        Object.values(this.subscriptions).forEach((user) => {
            if (user.rooms.includes(roomId) && user.senderId !== senderId) {
                user.ws.send(JSON.stringify({ e: "typing", senderId, isTyping }));
            }
        });
    }
    /** Publish messages to Redis */
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
    /** Clean up on connection close */
    handleClose(id) {
        const user = this.subscriptions[id];
        if (!user)
            return;
        user.rooms.forEach((roomId) => {
            // Unsubscribe Redis if no other local user in this room
            const hasLocalUsers = Object.values(this.subscriptions).some((u) => u.rooms.includes(roomId) && u.ws !== user.ws);
            if (!hasLocalUsers)
                this.subscribeClient.unsubscribe(roomId);
        });
        delete this.subscriptions[id];
        console.log(`[WS] Connection closed (${id})`);
    }
    /** Broadcast to all local sockets */
    broadcastToLocalSockets(roomId, senderId, message) {
        Object.values(this.subscriptions).forEach((user) => {
            if (user.rooms.includes(roomId) && user.senderId !== senderId) {
                user.ws.send(JSON.stringify(message));
            }
        });
    }
    generateId() {
        return Math.random().toString(36).substring(2);
    }
}
//# sourceMappingURL=wsmanager.js.map