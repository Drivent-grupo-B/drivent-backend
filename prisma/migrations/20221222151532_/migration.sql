/*
  Warnings:

  - Added the required column `EventId` to the `ActivityRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityRoom" ADD COLUMN     "EventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityRoom" ADD CONSTRAINT "ActivityRoom_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
