import { prisma } from "@/config";

async function findMany() {
  return prisma.daysEvent.findMany();
}

const activitiesRepository = {
  findMany,
};
  
export default activitiesRepository;  
