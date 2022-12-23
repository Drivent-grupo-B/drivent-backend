import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listDays, activitiesDay, listActivitiesRooms, createTicket } from "@/controllers";

const activitiesRoute = Router();

activitiesRoute
  .all("/*", authenticateToken)
  .get("/rooms", listActivitiesRooms)
  .get("/day", listDays)
  .get("/day/:dayId", activitiesDay)
  .post("/entry", createTicket);

export { activitiesRoute };
