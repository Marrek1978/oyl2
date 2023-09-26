/*
  Warnings:

  - You are about to drop the `Outcome` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "Outcome" DROP CONSTRAINT "Outcome_desireId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_outcomeId_fkey";

-- DropTable
DROP TABLE "Outcome";

-- CreateTable
CREATE TABLE "DesireOutcome" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "vision" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "desireId" TEXT NOT NULL,

    CONSTRAINT "DesireOutcome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireOutcome" ADD CONSTRAINT "DesireOutcome_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
