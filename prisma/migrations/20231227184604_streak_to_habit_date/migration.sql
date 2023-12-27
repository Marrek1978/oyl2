/*
  Warnings:

  - You are about to drop the `Streak` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Streak" DROP CONSTRAINT "Streak_habitId_fkey";

-- DropTable
DROP TABLE "Streak";

-- CreateTable
CREATE TABLE "HabitDate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isSuccess" BOOLEAN,
    "habitId" TEXT NOT NULL,

    CONSTRAINT "HabitDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitDate" ADD CONSTRAINT "HabitDate_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
