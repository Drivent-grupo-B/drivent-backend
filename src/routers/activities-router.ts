import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listDays, activitiesDay } from "@/controllers";

const activitiesRoute = Router();

activitiesRoute
  .all("/*", authenticateToken)
  .get("/day", listDays)
  .get("/activities/:dayId", activitiesDay);

export { activitiesRoute };
