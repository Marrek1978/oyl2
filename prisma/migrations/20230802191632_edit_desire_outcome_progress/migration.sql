/*
  Warnings:

  - You are about to drop the `DesireOutcomeMileStones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesireOutcomeMileStones" DROP CONSTRAINT "DesireOutcomeMileStones_desireOutcomeId_fkey";

-- DropTable
DROP TABLE "DesireOutcomeMileStones";

-- CreateTable
CREATE TABLE "DesireOutcomeProgress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "desireOutcomeId" TEXT NOT NULL,

    CONSTRAINT "DesireOutcomeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesireOutcomeProgress_title_desireOutcomeId_key" ON "DesireOutcomeProgress"("title", "desireOutcomeId");

-- AddForeignKey
ALTER TABLE "DesireOutcomeProgress" ADD CONSTRAINT "DesireOutcomeProgress_desireOutcomeId_fkey" FOREIGN KEY ("desireOutcomeId") REFERENCES "DesireOutcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
