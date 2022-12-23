import faker from "@faker-js/faker";
import { Activity, ActivityRoom, DaysEvent } from "@prisma/client";
import { prisma } from "@/config";
import dayjs from "dayjs";

export function createActivityRoom(EventId: number): Promise<ActivityRoom> {
  return prisma.activityRoom.create({
    data: {
      name: faker.lorem.slug(),
      EventId,
    }
  });
}

export function createEventDay(EventId: number): Promise<DaysEvent> {
  return prisma.daysEvent.create({
    data: {
      Day: faker.date.future(),
      EventId,
    }
  });
}

export function createActivity(DaysEventId: number, ActivityRoomId: number): Promise<Activity> {
  return prisma.activity.create({
    data: {
      name: faker.lorem.slug(),
      startTime: faker.date.future(),
      endTime: faker.date.future(),
      DaysEventId,
      ActivityRoomId,
    }
  });
}
