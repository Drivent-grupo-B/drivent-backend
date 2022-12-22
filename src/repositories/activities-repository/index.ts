import { prisma } from "@/config";

async function findManyRooms() {
  return prisma.activityRoom.findMany();
}

async function findMany() {
  return prisma.daysEvent.findMany();
}

async function findByDayId(dayId: number) {
  return prisma.activity.findMany({
    where: {
      DaysEventId: dayId
    },
    include: {
      ActivityRoom: true,
    }
  });
}

const activitiesRepository = {
  findMany,
  findByDayId,
  findManyRooms,
};
  
export default activitiesRepository;  
