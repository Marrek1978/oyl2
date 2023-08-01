/*
  Warnings:

  - You are about to drop the column `currentSituation` on the `Desire` table. All the data in the column will be lost.
  - You are about to drop the column `delta` on the `Desire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Desire" DROP COLUMN "currentSituation",
DROP COLUMN "delta",
ADD COLUMN     "current" TEXT,
ADD COLUMN     "ideal" TEXT,
ADD COLUMN     "outcomes" TEXT;
