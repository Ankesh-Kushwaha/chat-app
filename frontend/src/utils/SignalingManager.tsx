const base_url = import.meta.env.VITE_BASE_WSS_SERVER;
export interface SignalingMessage {
  id?: number;
  data: {
    e: string; // event type
    roomId?: string;
    [key: string]: unknown;
  };
}

type CallbackEntry = {
  id: string;
  callback: (data: any) => void;
};

export class SignalingManager {
  private ws!: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: SignalingMessage[] = [];
  private callbacks: Record<string, CallbackEntry[]> = {};
  private id = 1;
  private initialized = false;
  private reconnectInterval = 2000;
  private manualClose = false;

  private constructor() {
    this.connect();
  }

  public static getInstance(): SignalingManager {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  private connect() {
    this.ws = new WebSocket(base_url);

    this.ws.onopen = () => {
      this.initialized = true;
      console.info("[Signaling] Connected to server");
      this.flushBufferedMessages();
    };

  this.ws.onmessage = (event) => {
    try {
        const msg = JSON.parse(event.data);
        // Support both `{ e: "message", ... }` and `{ data: { e: "message", ... } }`
        const data = msg.data || msg;
        const type = data.e;
        if (this.callbacks[type]) {
          this.callbacks[type].forEach(({ callback }) => callback(data));
        } else {
          console.warn("[Signaling] No callback registered for", type);
        }
    } catch (err) {
      console.error("[Signaling] Failed to parse message", err, event.data);
    }
  };


    this.ws.onerror = (err) => {
      console.error("[Signaling] WebSocket error:", err);
    };

    this.ws.onclose = () => {
      this.initialized = false;
      console.warn("[Signaling] Connection closed");
      if (!this.manualClose) {
        console.log(`[Signaling] Attempting reconnect in ${this.reconnectInterval / 1000}s...`);
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };
  }

  private flushBufferedMessages() {
    this.bufferedMessages.forEach((msg) => this.sendMessage(msg));
    this.bufferedMessages = [];
  }

  public sendMessage(message: SignalingMessage) {
    const messageToSend = {
      ...message,
      id: this.id++,
    };

    if (!this.initialized) {
      this.bufferedMessages.push(messageToSend);
      console.debug("[Signaling] Buffered message:", messageToSend);
      return;
    }

    this.ws.send(JSON.stringify(messageToSend));
  }

  public async registerCallback(type: string, callback: (data: any) => void, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
  }

  public async deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      this.callbacks[type] = this.callbacks[type].filter((cb) => cb.id !== id);
      if (this.callbacks[type].length === 0) delete this.callbacks[type];
    }
  }

  public close() {
    this.manualClose = true;
    this.ws.close();
    console.info("[Signaling] Connection manually closed");
  }

  
  public emit(event: string, payload: Record<string, unknown> = {}) {
    this.sendMessage({ data: { e: event, ...payload } });
  }
}
