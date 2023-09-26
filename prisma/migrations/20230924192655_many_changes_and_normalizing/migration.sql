/*
  Warnings:

  - You are about to drop the column `projectId` on the `Desire` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the `DesireOutcome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequiredSavings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoutineTracker` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `outcomeId` on table `List` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outcomeId` on table `Milestone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outcomeId` on table `Routine` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DesireOutcome" DROP CONSTRAINT "DesireOutcome_desireId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_userId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_desireId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "RequiredSavings" DROP CONSTRAINT "RequiredSavings_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RequiredSavings" DROP CONSTRAINT "RequiredSavings_userId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_routineId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTracker" DROP CONSTRAINT "RoutineTracker_userId_fkey";

-- DropIndex
DROP INDEX "Desire_projectId_key";

-- AlterTable
ALTER TABLE "Desire" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "userId",
ALTER COLUMN "outcomeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "outcomeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "projectId",
ADD COLUMN     "desireId" TEXT,
ADD COLUMN     "outcomeId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "userId",
ALTER COLUMN "outcomeId" SET NOT NULL;

-- DropTable
DROP TABLE "DesireOutcome";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "RequiredSavings";

-- DropTable
DROP TABLE "RoutineTracker";

-- CreateTable
CREATE TABLE "Outcome" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "vision" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "desireId" TEXT NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsTracker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requiredAmount" INTEGER NOT NULL,
    "savedAmount" INTEGER NOT NULL DEFAULT 0,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "SavingsTracker_pkey" PRIMARY KEY ("id")
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
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "HabitTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsTracker" ADD CONSTRAINT "SavingsTracker_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitTracker" ADD CONSTRAINT "HabitTracker_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
