import { AuthenticatedRequest } from "@/middlewares";
import enrollmentsService from "@/services/enrollments-service";
import paymentService from "@/services/payments-service";
import ticketService from "@/services/tickets-service";
import { Response } from "express";
import Gerencianet from "gn-api-sdk-typescript";
import httpStatus from "http-status";

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketId = Number(req.query.ticketId);
    const { userId } = req;

    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const payment = await paymentService.getPaymentByTicketId(userId, ticketId);

    if (!payment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function paymentProcess(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const {
      ticketId,
      cardData,
      paiment_token
    } = req.body;

    if (!ticketId || !cardData || !paiment_token ) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    
    const user = await enrollmentsService.findWithAddressUserId(userId);
    
    const options = {
      client_id: process.env.CARD_CLIENT_ID,       
      client_secret: process.env.CARD_CLENT_SECRET,
      sandbox: true
    };
    
    const gerencianet = new Gerencianet(options);
    
    const { TicketType } = await ticketService.findTickeWithTypeById(ticketId);
  
    const body = {
      payment: {
        credit_card: {
          installments: 1,
          payment_token: paiment_token,
          billing_address: {
            street: user.Address[0].street,
            number: user.Address[0].number,
            neighborhood: user.Address[0].neighborhood,
            zipcode: user.Address[0].cep.replace(/-/g, ""),
            city: user.Address[0].city,
            state: user.Address[0].state
          },
          customer: {
            name: cardData.name,
            email: user.User.email,
            cpf: user.cpf,
            birth: user.birthday.toLocaleDateString("en-CA"),
            phone_number: user.phone.replace(/[^\d]+/g, "")
          }
        }
      },
      items: [{
        name: TicketType.name,
        value: TicketType.price,
        amount: 1
      }]
    };
    
    await gerencianet.createOneStepCharge([], body);
    
    const payment = await paymentService.paymentProcess(ticketId, userId, cardData);
  
    if (!payment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
