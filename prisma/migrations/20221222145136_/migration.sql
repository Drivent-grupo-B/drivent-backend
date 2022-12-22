/*
  Warnings:

  - You are about to drop the `Activitie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activitie" DROP CONSTRAINT "Activitie_ScheduleDayId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleDay" DROP CONSTRAINT "ScheduleDay_DaysEventId_fkey";

-- DropTable
DROP TABLE "Activitie";

-- DropTable
DROP TABLE "ScheduleDay";

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "DaysEventId" INTEGER NOT NULL,
    "ActivityRoomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRoom" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_DaysEventId_fkey" FOREIGN KEY ("DaysEventId") REFERENCES "DaysEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ActivityRoomId_fkey" FOREIGN KEY ("ActivityRoomId") REFERENCES "ActivityRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
