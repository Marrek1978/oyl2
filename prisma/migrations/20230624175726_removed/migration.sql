/*
  Warnings:

  - Made the column `sortOrder` on table `Values` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Values" ALTER COLUMN "sortOrder" SET NOT NULL,
ALTER COLUMN "sortOrder" SET DEFAULT 0;
