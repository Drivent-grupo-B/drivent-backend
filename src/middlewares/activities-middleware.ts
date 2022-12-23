import { NextFunction, Response } from "express";
import { AuthenticatedRequest, generateUnauthorizedResponse } from "./authentication-middleware";
import ticketService from "@/services/tickets-service";

export async function authenticateUserTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const ticket = await ticketService.getTicketByUserId(userId);
    if (ticket.TicketType.isRemote) return generateUnauthorizedResponse(res);

    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}
