import { prisma, redisClient } from "@/config";

async function createEntry(userId: number, activityId: number, dayId: number) {
  await redisClient.del(String(dayId));
  return prisma.entry.create({    
    data: {
      userId,
      activityId
    }
  });
}

async function findByActivityId(activityId: number) {
  return prisma.entry.findMany({    
    where: {
      activityId,
    }
  });
}

async function findUserActivities(userId: number) {
  return prisma.entry.findMany({    
    where: {
      userId,
    },
    include: {         
      Activity: true,      
    }
  });
}

const entriesRepository = {
  createEntry,
  findByActivityId,
  findUserActivities,
};
    
export default entriesRepository; 
