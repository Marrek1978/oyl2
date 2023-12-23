-- AlterTable
ALTER TABLE "Savings" ALTER COLUMN "requiredAmount" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "monthlyContribution" DROP NOT NULL,
ALTER COLUMN "estCompletionDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "monthySavings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "monthySavings_pkey" PRIMARY KEY ("id")
);
