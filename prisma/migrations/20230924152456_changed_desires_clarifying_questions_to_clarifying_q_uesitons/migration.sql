/*
  Warnings:

  - You are about to drop the `DesiresClarifyingQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesiresClarifyingQuestions" DROP CONSTRAINT "DesiresClarifyingQuestions_userId_fkey";

-- DropTable
DROP TABLE "DesiresClarifyingQuestions";

-- CreateTable
CREATE TABLE "ClarifyingQuestions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthDate" TIMESTAMP(3),
    "twentyFourHours" TEXT DEFAULT '',
    "twentyFourHoursRegrets" TEXT DEFAULT '',
    "oneWeek" TEXT DEFAULT '',
    "oneWeekRegrets" TEXT DEFAULT '',
    "oneMonth" TEXT DEFAULT '',
    "oneMonthRegrets" TEXT DEFAULT '',
    "oneYear" TEXT DEFAULT '',
    "oneYearRegrets" TEXT DEFAULT '',
    "fiveYears" TEXT DEFAULT '',
    "twentyYears" TEXT DEFAULT '',
    "fiftyYears" TEXT DEFAULT '',
    "maxAge" INTEGER DEFAULT 85,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ClarifyingQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClarifyingQuestions_userId_key" ON "ClarifyingQuestions"("userId");

-- AddForeignKey
ALTER TABLE "ClarifyingQuestions" ADD CONSTRAINT "ClarifyingQuestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
