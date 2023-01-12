import { PrismaClient } from "@prisma/client";
import { createClient } from "@redis/client";

export let prisma: PrismaClient;
const host = process.env.NODE_ENV === "docker" ? process.env.REDIS_HOST : "localhost";
export const redisClient = createClient({ 
  url: `redis://${host}:${process.env.REDIS_PORT}`
});

export function connectDb(): void {
  prisma = new PrismaClient();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}

export async function connectRedis(): Promise<void> {
  await redisClient.connect();
}
