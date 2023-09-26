/*
  Warnings:

  - You are about to drop the column `outcomeId` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the `MilestoneItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `milestoneId` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "MilestoneItem" DROP CONSTRAINT "MilestoneItem_milestoneId_fkey";

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "outcomeId",
ADD COLUMN     "complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "milestoneId" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "MilestoneItem";

-- CreateTable
CREATE TABLE "MilestoneGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "MilestoneGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MilestoneGroup" ADD CONSTRAINT "MilestoneGroup_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "MilestoneGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
