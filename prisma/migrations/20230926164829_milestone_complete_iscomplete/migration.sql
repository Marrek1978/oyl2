/*
  Warnings:

  - You are about to drop the column `complete` on the `Milestone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "complete",
ADD COLUMN     "iscomplete" BOOLEAN NOT NULL DEFAULT false;
