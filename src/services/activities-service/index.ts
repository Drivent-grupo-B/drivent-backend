import { notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";

async function listRooms() {
  const activitie = await activitiesRepository.findManyRooms();
  if( activitie.length === 0 ) throw notFoundError();
  return activitie;
}

async function listDays() {
  const activitie = await activitiesRepository.findMany();
  if( activitie.length === 0 ) throw notFoundError();
  return activitie;
}

async function listActivitiesDay(dayId: number) {
  return activitiesRepository.findByDayId(dayId);
}

const activitiesService = {
  listDays,
  listActivitiesDay,
  listRooms,
};

export default activitiesService;
