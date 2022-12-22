import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

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

    const list = await activitiesService.listactivitiesDay(dayId);

    return res.status(httpStatus.OK).send(list);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
