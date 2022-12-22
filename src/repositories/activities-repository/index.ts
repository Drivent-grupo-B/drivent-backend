import { prisma } from "@/config";

async function findMany() {
  return prisma.daysEvent.findMany();
}

async function findFirstDayId(dayId: number) {
  return prisma.daysEvent.findMany({
    where: {
      id: dayId
    }
  });
}

const activitiesRepository = {
  findMany,
  findFirstDayId,
};
  
export default activitiesRepository;  
