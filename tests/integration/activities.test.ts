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
  createTicketTypeRemote,
  createEvent,
} from "../factories";
import { createActivity, createActivityRoom, createEventDay } from "../factories/activities-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities/rooms", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/rooms");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const ticketType = await createTicketTypeRemote();

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of activities rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      const createdActivityRoom = await createActivityRoom(event.id);

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: createdActivityRoom.id,
          name: createdActivityRoom.name,
          EventId: createdActivityRoom.EventId,
          createdAt: createdActivityRoom.createdAt.toISOString(),
          updatedAt: createdActivityRoom.updatedAt.toISOString()
        }
      ]);
    });

    it("should respond with status 200 and an empty array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });
});

describe("GET /activities/day", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/day");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const ticketType = await createTicketTypeRemote();

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of event days", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      const createdActivityRoom = await createEventDay(event.id);

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: createdActivityRoom.id,
          Day: createdActivityRoom.Day.toISOString(),
          EventId: createdActivityRoom.EventId,
          createdAt: createdActivityRoom.createdAt.toISOString(),
          updatedAt: createdActivityRoom.updatedAt.toISOString()
        }
      ]);
    });

    it("should respond with status 200 and an empty array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });
});

describe("GET /activities/day:dayId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/day/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const ticketType = await createTicketTypeRemote();

      const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of event days", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      const createdActivityRoom = await createActivityRoom(event.id);
      const createdEventDay = await createEventDay(event.id);
      const createdActivity = await createActivity(createdEventDay.id, createdActivityRoom.id);

      const response = await server.get(`/activities/day/${createdEventDay.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: createdActivity.id,
          name: createdActivity.name,
          startTime: createdActivity.startTime.toISOString(),
          endTime: createdActivity.endTime.toISOString(),
          DaysEventId: createdActivity.DaysEventId,
          ActivityRoomId: createdActivity.ActivityRoomId,
          createdAt: createdActivity.createdAt.toISOString(),
          updatedAt: createdActivity.updatedAt.toISOString(),
          capacity: 1,
          ActivityRoom: {
            id: createdActivityRoom.id,
            name: createdActivityRoom.name,
            EventId: event.id,
            createdAt: createdActivityRoom.createdAt.toISOString(),
            updatedAt: createdActivityRoom.updatedAt.toISOString(),
          },
          Entry: [],
        }
      ]);
    });

    it("should respond with status 200 and an empty array", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      const createdEventDay = await createEventDay(event.id);

      const response = await server.get(`/activities/day/${createdEventDay.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });
});
