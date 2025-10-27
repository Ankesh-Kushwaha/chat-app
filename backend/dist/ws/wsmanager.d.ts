export declare class SignalingServer {
    private static instance;
    private wss;
    private publishClient;
    private subscribeClient;
    private subscriptions;
    private constructor();
    static getInstance(server?: any): Promise<SignalingServer>;
    /** WebSocket connection setup */
    private listen;
    private handleConnection;
    /** Handle incoming messages */
    private handleMessage;
    private handleSubscribe;
    private handleUnsubscribe;
    private handleTyping;
    private handlePublish;
    private handleClose;
    private broadcast;
    private isFirstSubscriber;
    private isLastSubscriber;
    private generateId;
}
//# sourceMappingURL=wsmanager.d.ts.map