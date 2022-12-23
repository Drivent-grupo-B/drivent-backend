import faker from "@faker-js/faker";
import { ActivityRoom } from "@prisma/client";
import { prisma } from "@/config";

export function createActivityRoom(EventId: number): Promise<ActivityRoom> {
  return prisma.activityRoom.create({
    data: {
      name: faker.lorem.slug(),
      EventId,
    }
  });
}
