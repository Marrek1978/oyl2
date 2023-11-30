/*
  Warnings:

  - You are about to drop the `Habits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Habits" DROP CONSTRAINT "Habits_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "Streak" DROP CONSTRAINT "Streak_habitId_fkey";

-- DropTable
DROP TABLE "Habits";

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
