import { createClient, type RedisClientType, type RedisDefaultModules } from "redis";

export async function main() {
  const publishClient = createClient();
  await publishClient.connect();

  const subscribeClient = createClient();
  await subscribeClient.connect();

  return { publishClient, subscribeClient };
}

export type RedisClients = Awaited<ReturnType<typeof main>>;
