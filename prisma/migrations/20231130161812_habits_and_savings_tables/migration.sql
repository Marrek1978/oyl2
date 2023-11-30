/*
  Warnings:

  - You are about to drop the `HabitTracker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavingsTracker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HabitTracker" DROP CONSTRAINT "HabitTracker_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "SavingsTracker" DROP CONSTRAINT "SavingsTracker_outcomeId_fkey";

-- DropTable
DROP TABLE "HabitTracker";

-- DropTable
DROP TABLE "SavingsTracker";

-- CreateTable
CREATE TABLE "Savings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "requiredAmount" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "savedAmount" INTEGER NOT NULL DEFAULT 0,
    "monthlyContribution" INTEGER NOT NULL,
    "estCompletionDate" TIMESTAMP(3) NOT NULL,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "Savings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsPayments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "month" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "savingsId" TEXT NOT NULL,

    CONSTRAINT "SavingsPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habits" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "outcomeId" TEXT NOT NULL,

    CONSTRAINT "Habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitCompletion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "failedDay" TIMESTAMP(3),
    "habitId" TEXT NOT NULL,

    CONSTRAINT "HabitCompletion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Savings" ADD CONSTRAINT "Savings_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsPayments" ADD CONSTRAINT "SavingsPayments_savingsId_fkey" FOREIGN KEY ("savingsId") REFERENCES "Savings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habits" ADD CONSTRAINT "Habits_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitCompletion" ADD CONSTRAINT "HabitCompletion_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
