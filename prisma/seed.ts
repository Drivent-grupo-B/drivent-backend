import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  console.log({ event });

  let hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    hotel = await prisma.hotel.create({
      data: {
        name: "Hotel Alvorada",
        image: "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768",            
      },
    });
  }

  console.log({ hotel });

}

async function seedRooms() {
  let room = await prisma.room.findFirst();
  if (!room) {
    const hotel = await prisma.hotel.findFirst();
    if (hotel){
      const totalOfRooms = 16;
      const initialRoom = 100;
      let roomType = 1;
      for (let i = 1; i <= totalOfRooms; i++) {
        await prisma.room.create({
          data: {
            name: String(initialRoom + i),
            capacity: roomType,
            hotelId: hotel.id,
            updatedAt: dayjs().toDate(),
          },
        });
        roomType++;
        if (roomType > 3) roomType = 1;
      }
    }    
  }
}


async function seedActivities() {
  const daysEvent = await prisma.daysEvent.findMany();
  const event = await prisma.event.findFirst();
  if (daysEvent.length < 2 && event) {
    await prisma.daysEvent.deleteMany({});
    let dayEvent = await prisma.daysEvent.create({
      data: {
        Day: dayjs().add(19, 'days').toDate(),
        EventId: event.id,
      }
    });

    console.log(dayEvent);

    dayEvent = await prisma.daysEvent.create({
      data: {
        Day: dayjs().add(20, 'days').toDate(),
        EventId: event.id,
      }
    });

    console.log(dayEvent);
  }

  let activityRooms = await prisma.activityRoom.findMany();
  if (activityRooms.length < 3) {
    await prisma.activityRoom.deleteMany({});
    const event = await prisma.event.findFirst();
    if (event){
      let activityRoom = await prisma.activityRoom.create({
        data: {
          EventId: event.id,
          name: 'Auditório principal'
        }
      });
      console.log(activityRoom);

    activityRoom = await prisma.activityRoom.create({
      data: {
        EventId: event.id,
        name: 'Auditório 1'
      }
    });

    console.log(activityRoom);

    activityRoom = await prisma.activityRoom.create({
      data: {
        EventId: event.id,
        name: 'Auditório 2'
      }
    });

    console.log(activityRoom);
    }    
  }

  const hasActivity = await prisma.activity.findMany();
  
  if(hasActivity.length === 0){
    const dayEventList = await prisma.daysEvent.findMany();
    activityRooms = await prisma.activityRoom.findMany();

    let activity = await prisma.activity.create({
      data: {
        name: 'Atividade 1',
        capacity: 1,
        startTime: new Date(dayEventList[0].Day.getFullYear(), dayEventList[0].Day.getMonth(), dayEventList[0].Day.getDay(), 10),
        endTime: new Date(dayEventList[0].Day.getFullYear(), dayEventList[0].Day.getMonth(), dayEventList[0].Day.getDay(), 11),
        ActivityRoomId: activityRooms[0].id,
        DaysEventId: dayEventList[0].id,
      }
    });

    console.log(activity);

    activity = await prisma.activity.create({
      data: {
        name: 'Atividade 2',
        capacity: 100,
        startTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 12),
        endTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 14),
        ActivityRoomId: activityRooms[0].id,
        DaysEventId: dayEventList[1].id,
      }
    });

    console.log(activity);

    activity = await prisma.activity.create({
      data: {
        name: 'Atividade 3',
        startTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 10),
        endTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 11),
        ActivityRoomId: activityRooms[1].id,
        DaysEventId: dayEventList[1].id,
      }
    });

    console.log(activity);

    activity = await prisma.activity.create({
      data: {
        name: 'Atividade 4',
        capacity: 2,
        startTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 10),
        endTime: new Date(dayEventList[1].Day.getFullYear(), dayEventList[1].Day.getMonth(), dayEventList[1].Day.getDay(), 11),
        ActivityRoomId: activityRooms[2].id,
        DaysEventId: dayEventList[1].id,
      }
    });

    console.log(activity);
  }
}

async function seedTicketTypes(){
  const ticketType = await prisma.ticketType.findMany()

  if(ticketType.length === 0){
    let ticketType = await prisma.ticketType.create({
      data: {
        name: 'Online',
        price: 10000,
        isRemote: true,
        includesHotel: false
      },
    });
    console.log(ticketType)

    ticketType = await prisma.ticketType.create({
      data: {
        name: 'Presencial',
        price: 60000,
        isRemote: false,
        includesHotel: true,
      },
    })

    ticketType = await prisma.ticketType.create({
      data: {
        name: 'Presencial',
        price: 25000,
        isRemote: false,
        includesHotel: false,
      },
    })

    console.log(ticketType)
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedRooms()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedActivities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

seedTicketTypes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
