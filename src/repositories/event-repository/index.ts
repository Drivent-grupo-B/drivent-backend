import { prisma, redisClient } from "@/config";

async function findFirst() {
  const eventCache = await redisClient.get("event");
  let event;

  if(!eventCache) {
    event = await prisma.event.findFirst();
    await redisClient.set("event", JSON.stringify(event));
    return event;
  }

  return JSON.parse(eventCache);
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
