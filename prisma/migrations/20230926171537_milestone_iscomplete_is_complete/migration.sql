/*
  Warnings:

  - You are about to drop the column `iscomplete` on the `Milestone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "iscomplete",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;
