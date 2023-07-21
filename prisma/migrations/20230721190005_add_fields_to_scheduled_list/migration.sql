/*
  Warnings:

  - You are about to drop the column `listId` on the `ScheduledList` table. All the data in the column will be lost.
  - Added the required column `description` to the `ScheduledList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `ScheduledList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `ScheduledList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledList" DROP COLUMN "listId",
ADD COLUMN     "description" JSONB NOT NULL,
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
