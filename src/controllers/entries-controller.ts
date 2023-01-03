import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import entriesService from "@/services/entries-service";

export async function createEntry(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  
  //TODO validação do JOI
  const activityId  = Number(req.body.activityId);

  if (!activityId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  
  try {
    const entry = await entriesService.createEntry(userId, activityId);
    
    return res.status(httpStatus.CREATED).send({ entryId: entry.id });
  } catch (error) {
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.CONFLICT);
    }
    return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}
