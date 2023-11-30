/*
  Warnings:

  - You are about to drop the `HabitCompletion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HabitCompletion" DROP CONSTRAINT "HabitCompletion_habitId_fkey";

-- DropTable
DROP TABLE "HabitCompletion";

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isSuccess" BOOLEAN,
    "habitId" TEXT NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
