// ws/wsmanager.ts
import { WebSocketServer, WebSocket } from "ws";
import { main, type RedisClients } from "../redisClient.js";

interface Subscription {
  ws: WebSocket;
  senderId: string;
  rooms: string[];
}

export class SignalingServer {
  private static instance: SignalingServer;
  private wss: WebSocketServer;
  private publishClient;
  private subscribeClient;
  private subscriptions: Record<string, Subscription> = {};

  private constructor(server: any, publishClient: any, subscribeClient: any) {
    this.publishClient = publishClient;
    this.subscribeClient = subscribeClient;

    // Attach WebSocket to existing HTTP server
    this.wss = new WebSocketServer({ server });
    console.log("[SignalingServer] WS attached to HTTP server");

    this.listen();
  }

  /** Singleton accessor */
  static async getInstance(server?: any) {
    if (!this.instance) {
      const { publishClient, subscribeClient }: RedisClients = await main();
      if (!server) throw new Error("HTTP server is required for production WS");
      this.instance = new SignalingServer(server, publishClient, subscribeClient);
    }
    return this.instance;
  }

  /** WebSocket connection setup */
  private listen() {
    this.wss.on("connection", (ws: WebSocket) => this.handleConnection(ws));
  }

  private handleConnection(ws: WebSocket) {
    const id = this.generateId();
    this.subscriptions[id] = { ws, senderId: "", rooms: [] };
    console.log(`[WS] New connection (${id})`);

    ws.on("message", (data) => this.handleMessage(id, data.toString()));
    ws.on("close", () => this.handleClose(id));
    ws.on("error", (err) => console.error(`[WS] Error (${id}):`, err));
  }

  /** Handle incoming messages */
  private handleMessage(id: string, rawData: string) {
    let parsed;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      console.error("[SignalingServer] Invalid JSON:", rawData);
      return;
    }

    const event = parsed.data?.e;
    if (!event) return;

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
  private handleSubscribe(id: string, data: any) {
    const { roomId, senderId } = data;
    const user = this.subscriptions[id];
    if (!user) return;

    // Add room to local subscription
    if (!user.rooms.includes(roomId)) user.rooms.push(roomId);
    user.senderId = senderId;

    // Always subscribe Redis to propagate messages for this room
    this.subscribeClient.subscribe(roomId, (message: string) => {
      const parsedMsg = JSON.parse(message);
      this.broadcastToLocalSockets(parsedMsg.roomId, parsedMsg.senderId, parsedMsg);
    });
  }

  private handleUnsubscribe(id: string, data: any) {
    const { roomId } = data;
    const user = this.subscriptions[id];
    if (!user) return;

    user.rooms = user.rooms.filter((r) => r !== roomId);

    // Optional: Unsubscribe Redis if no local user in room
    const hasLocalUsers = Object.values(this.subscriptions).some((u) => u.rooms.includes(roomId));
    if (!hasLocalUsers) this.subscribeClient.unsubscribe(roomId);
  }

  /** Broadcast typing events to local users */
  private handleTyping(data: any) {
    const { roomId, senderId, isTyping } = data;
    Object.values(this.subscriptions).forEach((user) => {
      if (user.rooms.includes(roomId) && user.senderId !== senderId) {
        user.ws.send(JSON.stringify({ e: "typing", senderId, isTyping }));
      }
    });
  }

  /** Publish messages to Redis */
  private handlePublish(data: any) {
    const { roomId, message, senderId, userName, avatar } = data;
    this.publishClient.publish(
      roomId,
      JSON.stringify({
        e: "message",
        roomId,
        message,
        senderId,
        userName,
        avatar,
        time: new Date().toISOString(),
      })
    );
  }

  /** Clean up on connection close */
  private handleClose(id: string) {
    const user = this.subscriptions[id];
    if (!user) return;

    user.rooms.forEach((roomId) => {
      // Unsubscribe Redis if no other local user in this room
      const hasLocalUsers = Object.values(this.subscriptions).some((u) => u.rooms.includes(roomId) && u.ws !== user.ws);
      if (!hasLocalUsers) this.subscribeClient.unsubscribe(roomId);
    });

    delete this.subscriptions[id];
    console.log(`[WS] Connection closed (${id})`);
  }

  /** Broadcast to all local sockets */
  private broadcastToLocalSockets(roomId: string, senderId: string, message: any) {
    Object.values(this.subscriptions).forEach((user) => {
      if (user.rooms.includes(roomId) && user.senderId !== senderId) {
        user.ws.send(JSON.stringify(message));
      }
    });
  }

  private generateId() {
    return Math.random().toString(36).substring(2);
  }
}
