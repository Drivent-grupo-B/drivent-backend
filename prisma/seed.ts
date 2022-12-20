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
        name: "Hotel Sunset",
        image: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",            
      },
    });
  }

  console.log({ hotel });

}

async function seedRooms() {
  let hotel = await prisma.room.findFirst({
    where: {
      hotelId: 1,
    },
  });
  if (!hotel) {
    const totalOfRooms = 16;
    const initialRoom = 100;
    let roomType = 1;
    for (let i = 1; i <= totalOfRooms; i++) {
      await prisma.room.create({
        data: {
          name: String(initialRoom + i),
          capacity: roomType,
          hotelId: 1,
          updatedAt: dayjs().toDate(),
        },
      });
      roomType++;
      if (roomType > 3) roomType = 1;
    }
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
