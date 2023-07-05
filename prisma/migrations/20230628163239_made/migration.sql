/*
  Warnings:

  - You are about to drop the column `twentyFourRegrets` on the `DesiresClarifyingQuestions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DesiresClarifyingQuestions" DROP COLUMN "twentyFourRegrets",
ADD COLUMN     "twentyFourHoursRegrets" TEXT DEFAULT '';
