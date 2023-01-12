import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDB, connectRedis, redisClient } from "@/config";

loadEnv();

import { handleApplicationErrors } from "@/middlewares";
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  paymentsRouter,
  hotelsRouter,
  bookingRouter,
  activitiesRoute
} from "@/routers";

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/users", usersRouter)
  .use("/auth", authenticationRouter)
  .use("/event", eventsRouter)
  .use("/enrollments", enrollmentsRouter)
  .use("/tickets", ticketsRouter)
  .use("/payments", paymentsRouter)
  .use("/hotels", hotelsRouter)
  .use("/booking", bookingRouter)
  .use("/activities", activitiesRoute)
  .use(handleApplicationErrors);

app.get("/jao", async (req, res) => {
  await redisClient.set("user", "Filipe");
  const user = await redisClient.get("user");
  res.send(user);
});

export async function init(): Promise<Express> {
  connectDb();
  await connectRedis();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
