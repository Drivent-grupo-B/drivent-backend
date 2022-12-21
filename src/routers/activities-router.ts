import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { listDays } from "@/controllers";

const activitiesRoute = Router();

activitiesRoute
  .all("/*", authenticateToken)
  .get("/day", listDays);
export { activitiesRoute };
