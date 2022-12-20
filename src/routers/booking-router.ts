import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, listRoomBookings } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", listBooking)
  .get("/:roomId", listRoomBookings)
  .post("", bookingRoom)
  .put("", changeBooking);

export { bookingRouter };
