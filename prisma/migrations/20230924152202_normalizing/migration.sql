/*
  Warnings:

  - You are about to drop the `RequiredSavings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoutineTracker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RequiredSavings" DROP CONSTRAINT "RequiredSavings_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RequiredSavings" DROP CONSTRAINT "RequiredSavings_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_routineId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_userId_fkey";

-- DropTable
DROP TABLE "RequiredSavings";

-- DropTable
DROP TABLE "RoutineTracker";

-- CreateTable
CREATE TABLE "SavingTracker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requiredAmount" INTEGER NOT NULL,
    "savedAmount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "SavingTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitTracker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HabitTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingTracker" ADD CONSTRAINT "SavingTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingTracker" ADD CONSTRAINT "SavingTracker_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTracker" ADD CONSTRAINT "HabitTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
