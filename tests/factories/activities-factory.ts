import faker from "@faker-js/faker";
import { Activity, ActivityRoom, DaysEvent, Entry } from "@prisma/client";
import { prisma } from "@/config";

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
export function createActivityDatefixed(DaysEventId: number, ActivityRoomId: number): Promise<Activity> {
  return prisma.activity.create({
    data: {
      name: faker.lorem.slug(),
      startTime: "2023-01-02T03:00:00.000Z",
      endTime: "2023-01-02T04:00:00.000Z",
      capacity: 3,
      DaysEventId,
      ActivityRoomId,
    }
  });
}

export function createActivity(DaysEventId: number, ActivityRoomId: number): Promise<Activity> {
  return prisma.activity.create({
    data: {
      name: faker.lorem.slug(),
      startTime: faker.date.future(),
      endTime: faker.date.future(),
      capacity: 3,
      DaysEventId,
      ActivityRoomId,
    }
  });
}

export function createEntry(userId: number, activityId: number): Promise<Entry> {
  return prisma.entry.create({
    data: {
      userId,
      activityId 
    }
  });
}

