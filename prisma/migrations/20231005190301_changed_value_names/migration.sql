/*
  Warnings:

  - You are about to drop the column `valueDescription` on the `Value` table. All the data in the column will be lost.
  - You are about to drop the column `valueTitle` on the `Value` table. All the data in the column will be lost.
  - Added the required column `description` to the `Value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Value` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Value" DROP COLUMN "valueDescription",
DROP COLUMN "valueTitle",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
