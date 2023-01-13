import { conflictError, requestError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import entriesRepository from "@/repositories/entries-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Activity, Entry } from "@prisma/client";

async function createEntry(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.status !== "PAID") {
    throw requestError(402, "PAYMENT_REQUIRED");
  }

  const activity = await activitiesRepository.findById(activityId);
  const entriesOnActivity = await entriesRepository.findByActivityId(activityId);
  if (entriesOnActivity.length === activity.capacity) {
    throw conflictError("OverCapacity!");
  }

  const userActivities = await entriesRepository.findUserActivities(userId);
  checkConflictingActivities(userActivities, activity);  
  const entry = await entriesRepository.createEntry(userId, activityId, activity.DaysEventId);

  return entry;
}

function checkConflictingActivities(userActivities: (Entry & {
    Activity: Activity;
})[], activity: Activity) {  
  const userDayActivities = userActivities.filter(
    (userActivity) => userActivity.Activity.DaysEventId === activity.DaysEventId
  );
  const start1 = activity.startTime;
  const end1 = activity.endTime;

  userDayActivities.forEach((userActivity) => {
    const start2 = userActivity.Activity.startTime;
    const end2 = userActivity.Activity.endTime;
    if ((start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2)) {
      throw conflictError("ConflictingHours!");
    }
  });
}

const entriesService = {
  createEntry,
};

export default entriesService;
