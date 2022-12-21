-- CreateTable
CREATE TABLE "DaysEvent" (
    "id" SERIAL NOT NULL,
    "Day" TIMESTAMP(3) NOT NULL,
    "EventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DaysEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleDay" (
    "id" SERIAL NOT NULL,
    "DaysEventId" INTEGER NOT NULL,
    "MainAudito" BOOLEAN NOT NULL,
    "RoomWork" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activitie" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "hourInit" TIMESTAMP(3) NOT NULL,
    "hourfinal" TIMESTAMP(3) NOT NULL,
    "ScheduleDayId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activitie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DaysEvent" ADD CONSTRAINT "DaysEvent_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleDay" ADD CONSTRAINT "ScheduleDay_DaysEventId_fkey" FOREIGN KEY ("DaysEventId") REFERENCES "DaysEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activitie" ADD CONSTRAINT "Activitie_ScheduleDayId_fkey" FOREIGN KEY ("ScheduleDayId") REFERENCES "ScheduleDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
