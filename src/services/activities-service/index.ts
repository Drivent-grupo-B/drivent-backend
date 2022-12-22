import activitiesRepository from "@/repositories/activities-repository";

async function listDays() {
  return await activitiesRepository.findMany();
}

async function listactivitiesDay(dayId: number) {
  return await activitiesRepository.findFirstDayId(dayId);
}

const activitiesService = {
  listDays,
  listactivitiesDay
};

export default activitiesService;
