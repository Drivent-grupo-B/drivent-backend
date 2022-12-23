import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listDays, activitiesDay, listActivitiesRooms } from "@/controllers";
import { authenticateUserTicket } from "@/middlewares/activities-middleware";

const activitiesRoute = Router();

activitiesRoute
  .all("/*", authenticateToken, authenticateUserTicket)
  .get("/rooms", listActivitiesRooms)
  .get("/day", listDays)
  .get("/day/:dayId", activitiesDay);

export { activitiesRoute };
