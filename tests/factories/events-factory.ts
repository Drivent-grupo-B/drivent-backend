import dayjs from "dayjs";
import faker from "@faker-js/faker";
import { Event } from "@prisma/client";
import { prisma } from "@/config";

export function createEvent(params: Partial<Event> = {}): Promise<Event> {
  return prisma.event.create({
    data: {
      title: params.title || faker.lorem.sentence(),
      backgroundImageUrl: params.backgroundImageUrl || faker.image.imageUrl(),
      logoImageUrl: params.logoImageUrl || faker.image.imageUrl(),
      startsAt: params.startsAt || dayjs().subtract(1, "day").toDate(),
      endsAt: params.endsAt || dayjs().add(5, "days").toDate(),
    },
  });
}

export function createDay(EventId: number) {
  return prisma.daysEvent.create({
    data: {
      Day: "2023/01/03",
      EventId
    } 
  });
}

export function createActivityRoom(EventId: number) {
  return prisma.activityRoom.create({
    data: {
      name: "Auditório principal",
      EventId
    } 
  });
}

type CreateActivies = {
  DaysEventId: number,
  ActivityRoomId: number,
}

export function createActivies({ DaysEventId, ActivityRoomId }: CreateActivies) {
  return prisma.activity.create({
    data: {
      name: faker.name.firstName(),
      startTime: "2023/01/03, 10:00",
      endTime: "2023/01/03, 11:00",
      DaysEventId,
      ActivityRoomId
    }
  });
}
