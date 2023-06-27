/*
  Warnings:

  - You are about to drop the column `desireDescription` on the `Desires` table. All the data in the column will be lost.
  - You are about to drop the column `desireTitle` on the `Desires` table. All the data in the column will be lost.
  - Added the required column `description` to the `Desires` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Desires` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Desires" DROP COLUMN "desireDescription",
DROP COLUMN "desireTitle",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
