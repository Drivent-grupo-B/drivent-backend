import { prisma, redisClient } from "@/config";

async function findManyRooms() {
  return prisma.activityRoom.findMany();
}

async function findMany() {
  return prisma.daysEvent.findMany();
}

async function findByDayId(dayId: number) {
  const DayActivitiesCache = await redisClient.get(String(dayId));
  let activities;

  if (!DayActivitiesCache) {
    activities = await prisma.activity.findMany({
      where: {
        DaysEventId: dayId,
      },
      include: {
        ActivityRoom: true,
        Entry: true,
      },
    });
    await redisClient.set(String(dayId), JSON.stringify(activities));
    return activities;
  }
  return JSON.parse(DayActivitiesCache);
}

async function findById(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });
}

const activitiesRepository = {
  findMany,
  findByDayId,
  findManyRooms,
  findById,
};

export default activitiesRepository;
