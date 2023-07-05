-- CreateTable
CREATE TABLE "DesiresClarifyingQuestions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "twentyFourHours" TEXT NOT NULL,
    "twentyFourRegrets" TEXT NOT NULL,
    "oneWeek" TEXT NOT NULL,
    "oneWeekRegrets" TEXT NOT NULL,
    "oneMonth" TEXT NOT NULL,
    "oneMonthRegrets" TEXT NOT NULL,
    "oneYear" TEXT NOT NULL,
    "fiveYears" TEXT NOT NULL,
    "twentyYears" TEXT NOT NULL,
    "fiftyYears" TEXT NOT NULL,

    CONSTRAINT "DesiresClarifyingQuestions_pkey" PRIMARY KEY ("id")
);
