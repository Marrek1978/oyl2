/*
  Warnings:

  - You are about to drop the column `order` on the `Values` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Values" DROP COLUMN "order",
ADD COLUMN     "sortOrder" INTEGER;
