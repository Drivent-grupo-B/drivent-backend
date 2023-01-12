import { prisma } from "@/config";

async function findManyRooms() {
  return prisma.activityRoom.findMany();
}

async function findMany() {
  return prisma.daysEvent.findMany();
}

async function findByDayId(dayId: number) {
  const activities =  await prisma.activity.findMany({
    where: {
      DaysEventId: dayId
    },
    include: {
      ActivityRoom: true,
      Entry: true,
    }
  });

  return activities;
}

async function findById(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId
    }
  });
}

const activitiesRepository = {
  findMany,
  findByDayId,
  findManyRooms,
  findById,
};
  
export default activitiesRepository;  
