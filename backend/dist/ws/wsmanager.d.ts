export declare class SignalingServer {
    private static instance;
    private wss;
    private publishClient;
    private subscribeClient;
    private subscriptions;
    private activeRedisRooms;
    private constructor();
    static getInstance(server?: any): Promise<SignalingServer>;
    private listen;
    private handleConnection;
    private handleMessage;
    private handleSubscribe;
    private handleUnsubscribe;
    private handleTyping;
    private handlePublish;
    private handleClose;
    private broadcastToLocalSockets;
    private generateId;
}
//# sourceMappingURL=wsmanager.d.ts.map