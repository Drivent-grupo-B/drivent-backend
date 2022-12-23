import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function listActivitiesRooms(req: AuthenticatedRequest, res: Response) {
  try {
    const activitiesRooms = await activitiesService.listRooms();
    return res.status(httpStatus.OK).send(activitiesRooms);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function listDays(req: AuthenticatedRequest, res: Response) {
  try {
    const days = await activitiesService.listDays();
    return res.status(httpStatus.OK).send(days);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function activitiesDay(req: AuthenticatedRequest, res: Response) {
  try {
    const dayId = Number(req.params.dayId);

    const list = await activitiesService.listActivitiesDay(dayId);

    return res.status(httpStatus.OK).send(list);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createEntry(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  //TODO validação do JOI
  const { activityId } = req.body;

  if (!activityId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const entry = await activitiesService.createEntry(userId, activityId);

    return res.status(httpStatus.CREATED).send(entry.id);
  } catch (error) {
    if (error.name === "CannotEntryError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}
