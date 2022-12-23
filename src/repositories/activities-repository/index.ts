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
      Entry: true,
    }
  });
}

async function createEntry(userId: number, activityId: number) {
  return prisma.entry.create({    
    data: {
      userId,
      activityId
    }
  });
}

const activitiesRepository = {
  findMany,
  findByDayId,
  findManyRooms,
  createEntry,
};
  
export default activitiesRepository;  
