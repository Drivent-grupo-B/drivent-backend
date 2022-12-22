import activitiesRepository from "@/repositories/activities-repository";

async function listRooms() {
  return await activitiesRepository.findManyRooms();
}

async function listDays() {
  return await activitiesRepository.findMany();
}

async function listActivitiesDay(dayId: number) {
  return await activitiesRepository.findByDayId(dayId);
}

const activitiesService = {
  listDays,
  listActivitiesDay,
  listRooms,
};

export default activitiesService;
