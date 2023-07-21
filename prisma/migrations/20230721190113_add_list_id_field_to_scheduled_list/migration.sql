/*
  Warnings:

  - Added the required column `listId` to the `ScheduledList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledList" ADD COLUMN     "listId" TEXT NOT NULL;
