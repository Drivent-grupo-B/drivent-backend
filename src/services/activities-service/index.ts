import { cannotEntryError, requestError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function listRooms() {
  return await activitiesRepository.findManyRooms();
}

async function listDays() {
  return await activitiesRepository.findMany();
}

async function listActivitiesDay(dayId: number) {
  return await activitiesRepository.findByDayId(dayId);
}

async function createEntry(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotEntryError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id); 
  if (ticket.status !== "PAID") {
    throw requestError(402, "PAYMENT_REQUIRED");
  }  
  //TODO: verify capacity and hours
  await activitiesRepository.createEntry(userId, activityId);

  return ticket;
}

const activitiesService = {
  listDays,
  listActivitiesDay,
  listRooms,
  createEntry
};

export default activitiesService;
