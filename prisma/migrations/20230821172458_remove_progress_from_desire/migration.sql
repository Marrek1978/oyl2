/*
  Warnings:

  - You are about to drop the column `dueDate` on the `DesireOutcome` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesireOutcomeProgress" DROP CONSTRAINT "DesireOutcomeProgress_desireOutcomeId_fkey";

-- AlterTable
ALTER TABLE "DesireOutcome" DROP COLUMN "dueDate";
