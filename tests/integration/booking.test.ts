import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createHotel,
  createRoomWithHotelId,
  createBooking
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

function noToken(method: (url: string)=> supertest.Test, rout: string) {
  it("should respond with status 401 if no token is given", async () => {
    const validBody = createValidBody();
    const response = await method(rout).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const validBody = createValidBody();
    const response = await method(rout).set("Authorization", `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const validBody = createValidBody();
    const response = await method(rout).set("Authorization", `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
}

describe("GET /booking", () => {
  const i = server.get;
  noToken(i, "/booking");

  describe("when token is valid", () => {
    it("should respond with status 404 when user has not a booking ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 when user has a booking ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const booking = await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
      });
    });
  });
});

function createValidBody() {
  return {
    "roomId": 1
  };
}

describe("POST /booking", () => {
  const i = server.post;
  noToken(i, "/booking");

  describe("when token is valid", () => {
    it("should respond with status 200 with a valid body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      createValidBody();
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.OK);
    });
    it("should respond with status 400 with a invalid body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);

      createValidBody();
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: 0,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with status 404 with a invalid body - there's not roomId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      createValidBody();
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id + 1,
      });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 403 with a invalid body - there's not vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });
      await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if user has not enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeWithHotel();

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if user has not paymented ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe("PUT /booking", () => {
  const i = server.put;
  noToken(i, "/booking");

  describe("when token is valid", () => {
    it("should respond with status 200 with a valid body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      const otherRoom = await createRoomWithHotelId(hotel.id);

      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: otherRoom.id,
      });
      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 400 with invalid bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      await createRoomWithHotelId(hotel.id);

      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: 0,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with status 400 with a invalid body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      await createBooking({
        roomId: room.id,
        userId: user.id,
      });

      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: hotel,
      });

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });
    it("should respond with status 404 with a invalid body - there's no roomId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      await createBooking({
        roomId: room.id,
        userId: user.id,
      });
      createValidBody();
      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: room.id + 1,
      });
      
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 with a invalid body - there's not vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      await createRoomWithHotelId(hotel.id);

      const otherRoom = await createRoomWithHotelId(hotel.id);
      await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });
      await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });
      await createBooking({
        userId: user.id,
        roomId: otherRoom.id,
      });

      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: otherRoom.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 when user has not a booking ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const otherUser = await createUser();
      const otherUserBooking = await createBooking({
        userId: otherUser.id,
        roomId: room.id,
      });

      createValidBody();
      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`).send({
        roomId: otherUserBooking.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
  });
});

describe("GET /booking/:roomId", () => {
  const i = server.put;
  noToken(i, "/booking/1");

  describe("when token is valid", () => {
    it("should respond with status 200 with a valid ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking({
        roomId: room.id,
        userId: user.id,
      });
      await createRoomWithHotelId(hotel.id);

      const response = await server.get(`/booking/${room.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([{
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(), 
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(), 
        }
      }]);
    });

    it("should respond with status 400 when the query is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/booking/oi").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when query value does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      await createBooking({
        roomId: room.id,
        userId: user.id,
      });
      await createRoomWithHotelId(hotel.id);

      const response = await server.get(`/booking/${room.id+1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
      expect(response.body).toEqual([]);
    });
  });
});
