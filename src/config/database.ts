import { PrismaClient } from "@prisma/client";
import { createClient } from "@redis/client";

export let prisma: PrismaClient;
export const redisClient = createClient({ 
  url: "redis://redisDB:6379"
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
