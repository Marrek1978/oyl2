/*
  Warnings:

  - Added the required column `oneYearRegrets` to the `DesiresClarifyingQuestions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DesiresClarifyingQuestions" ADD COLUMN     "oneYearRegrets" TEXT NOT NULL;
