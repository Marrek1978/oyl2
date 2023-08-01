/*
  Warnings:

  - You are about to drop the column `outcomes` on the `Desire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Desire" DROP COLUMN "outcomes";

-- CreateTable
CREATE TABLE "DesireOutcomes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "desireId" TEXT NOT NULL,

    CONSTRAINT "DesireOutcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesireOutcomeMileStones" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "desireOutcomeId" TEXT NOT NULL,

    CONSTRAINT "DesireOutcomeMileStones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesireOutcomes_title_desireId_key" ON "DesireOutcomes"("title", "desireId");

-- CreateIndex
CREATE UNIQUE INDEX "DesireOutcomeMileStones_title_desireOutcomeId_key" ON "DesireOutcomeMileStones"("title", "desireOutcomeId");

-- AddForeignKey
ALTER TABLE "DesireOutcomes" ADD CONSTRAINT "DesireOutcomes_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireOutcomeMileStones" ADD CONSTRAINT "DesireOutcomeMileStones_desireOutcomeId_fkey" FOREIGN KEY ("desireOutcomeId") REFERENCES "DesireOutcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
