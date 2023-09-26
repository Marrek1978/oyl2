/*
  Warnings:

  - You are about to drop the column `milestoneId` on the `Milestone` table. All the data in the column will be lost.
  - Added the required column `milestoneGroupId` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_milestoneId_fkey";

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "milestoneId",
ADD COLUMN     "milestoneGroupId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_milestoneGroupId_fkey" FOREIGN KEY ("milestoneGroupId") REFERENCES "MilestoneGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
