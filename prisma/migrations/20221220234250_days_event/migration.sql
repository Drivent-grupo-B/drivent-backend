-- CreateTable
CREATE TABLE "DaysEvent" (
    "id" SERIAL NOT NULL,
    "Day" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DaysEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DaysEvent" ADD CONSTRAINT "DaysEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
