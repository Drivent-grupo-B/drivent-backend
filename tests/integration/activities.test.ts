import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/config";
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
import { createActivity, createEntry, createActivityRoom, createEventDay, createActivityDatefixed } from "../factories/activities-factory";
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
    const response = await method(rout);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get(rout).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(rout).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
}

describe("GET /activities/rooms", () => {
  const i = server.get;
  noToken(i, "/activities/rooms");
  
  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of activities rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
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
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/activities/rooms").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      expect(response.body).toEqual([]);
    });
  });
});

describe("GET /activities/day", () => {
  const i = server.get;
  noToken(i, "/activities/day");
  
  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of event days", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
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
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/activities/day").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
      expect(response.body).toEqual([]);
    });
  });
});

describe("GET /activities/day:dayId", () => {
  const i = server.get;
  noToken(i, "/activities/day/1");
  
  describe("when token is valid", () => {
    it("should respond with status 401 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 400 when the query is invalid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      await createEventDay(event.id);

      const response = await server.get("/activities/day/oi").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.get("/activities/day/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 200 and a list of event days", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
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
          capacity: createdActivity.capacity,
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
      await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();

      const createdEventDay = await createEventDay(event.id);

      const response = await server.get(`/activities/day/${createdEventDay.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([]);
    });
  });
});

describe("POST /activities/entry", () => {
  const i = server.post;
  noToken(i, "/activities/entry");
  
  describe("when token is valid", () => {
    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeWithHotel();

      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 400 when you don't hear correct body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const body = {
        body: 0
      };

      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 401 when you don't enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress();
      const body = {
        activityId: 1
      };

      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 402 when you don't paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const body = {
        activityId: 1
      };
      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 409 when you no longer hear capacity for the activity.", async () => {
      const user1 = await createUser();
      const user2 = await createUser();
      const token = await generateValidToken(user1);
      const enrollment = await createEnrollmentWithAddress(user1);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();
      const eventDay = await createEventDay(event.id);
      const eventDayRoom = await createActivityRoom(event.id);
      const activitie = await createActivity(eventDay.id, eventDayRoom.id);
      await createEntry(user2.id, activitie.id);
      await createEntry(user2.id, activitie.id);
      await createEntry(user2.id, activitie.id);

      const body = {
        activityId: activitie.id
      };

      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body);
  
      expect(response.status).toEqual(httpStatus.CONFLICT);
    });
   
    it("should respond with status 409 when the activity time is the same.", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();
      const eventDay = await createEventDay(event.id);
      const eventDayRoom = await createActivityRoom(event.id);
      const activitie = await createActivityDatefixed(eventDay.id, eventDayRoom.id);
      await createEntry(user.id, activitie.id);
      const body = {
        activityId: activitie.id
      };
 
      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body );
  
      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it("should respond with status 200 when everything is right.", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const event = await createEvent();
      const eventDay = await createEventDay(event.id);
      const eventDayRoom = await createActivityRoom(event.id);
      const activitie = await createActivity(eventDay.id, eventDayRoom.id);
      const body = {
        activityId: activitie.id
      };

      const response = await server.post("/activities/entry").set("Authorization", `Bearer ${token}`).send(body );
      const entry = await prisma.entry.findFirst();
      expect(response.status).toEqual(httpStatus.CREATED);
      expect(response.body).toEqual({ entryId: entry.id });
    });
  });
});
