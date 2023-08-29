/*
  Warnings:

  - You are about to drop the column `outcomeId` on the `Routine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_outcomeId_fkey";

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "outcomeId";
