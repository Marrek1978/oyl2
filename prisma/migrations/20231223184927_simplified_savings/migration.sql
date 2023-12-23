/*
  Warnings:

  - You are about to drop the column `estCompletionDate` on the `Savings` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyContribution` on the `Savings` table. All the data in the column will be lost.
  - You are about to drop the column `savedAmount` on the `Savings` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Savings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Savings" DROP COLUMN "estCompletionDate",
DROP COLUMN "monthlyContribution",
DROP COLUMN "savedAmount",
DROP COLUMN "startDate";
