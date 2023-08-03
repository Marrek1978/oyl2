/*
  Warnings:

  - You are about to drop the column `date` on the `DesireOutcomeProgress` table. All the data in the column will be lost.
  - You are about to drop the `DesireOutcomes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesireOutcomeProgress" DROP CONSTRAINT "DesireOutcomeProgress_desireOutcomeId_fkey";

-- DropForeignKey
ALTER TABLE "DesireOutcomes" DROP CONSTRAINT "DesireOutcomes_desireId_fkey";

-- AlterTable
ALTER TABLE "Desire" ADD COLUMN     "achieved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DesireOutcomeProgress" DROP COLUMN "date",
ADD COLUMN     "complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dueDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "DesireOutcomes";

-- CreateTable
CREATE TABLE "DesireOutcome" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "desireId" TEXT NOT NULL,

    CONSTRAINT "DesireOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesireOutcome_title_desireId_key" ON "DesireOutcome"("title", "desireId");

-- AddForeignKey
ALTER TABLE "DesireOutcome" ADD CONSTRAINT "DesireOutcome_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireOutcomeProgress" ADD CONSTRAINT "DesireOutcomeProgress_desireOutcomeId_fkey" FOREIGN KEY ("desireOutcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
