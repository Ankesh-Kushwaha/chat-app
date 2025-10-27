export declare class SignalingServer {
    private static instance;
    private wss;
    private publishClient;
    private subscribeClient;
    private subscriptions;
    private constructor();
    /** Singleton accessor */
    static getInstance(server?: any): Promise<SignalingServer>;
    /** WebSocket connection setup */
    private listen;
    private handleConnection;
    /** Handle incoming messages */
    private handleMessage;
    /** Subscribe local user to a room and Redis channel */
    private handleSubscribe;
    private handleUnsubscribe;
    /** Broadcast typing events to local users */
    private handleTyping;
    /** Publish messages to Redis */
    private handlePublish;
    /** Clean up on connection close */
    private handleClose;
    /** Broadcast to all local sockets */
    private broadcastToLocalSockets;
    private generateId;
}
//# sourceMappingURL=wsmanager.d.ts.map