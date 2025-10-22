import { createClient } from "redis";
export async function main() {
    const publishClient = createClient();
    await publishClient.connect();
    const subscribeClient = createClient();
    await subscribeClient.connect();
    return { publishClient, subscribeClient };
}
//# sourceMappingURL=redisClient.js.map