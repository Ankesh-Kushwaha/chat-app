export declare class SignalingServer {
    private static instance;
    private wss;
    private publishClient;
    private subscribeClient;
    private subscriptions;
    private constructor();
    static getInstance(): Promise<SignalingServer>;
    /** WebSocket Connection Setup */
    private listen;
    private handleConnection;
    /** Handle incoming messages from clients */
    private handleMessage;
    /** --- Handlers --- */
    private handleSubscribe;
    private handleUnsubscribe;
    private handleTyping;
    private handlePublish;
    /** --- Utility Methods --- */
    private handleClose;
    private broadcast;
    private isFirstSubscriber;
    private isLastSubscriber;
    private generateId;
}
//# sourceMappingURL=wsmanager.d.ts.map