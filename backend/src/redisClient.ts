import { createClient, type RedisClientType, type RedisDefaultModules } from "redis";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379"; 

export async function main() {
  const publishClient = createClient({url:redisUrl});
  await publishClient.connect();

  const subscribeClient = createClient({url:redisUrl});
  await subscribeClient.connect();

  return { publishClient, subscribeClient };
}

export type RedisClients = Awaited<ReturnType<typeof main>>;
