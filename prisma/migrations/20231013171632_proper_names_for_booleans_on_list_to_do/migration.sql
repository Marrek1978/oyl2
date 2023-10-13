/*
  Warnings:

  - You are about to drop the column `complete` on the `ListToDo` table. All the data in the column will be lost.
  - You are about to drop the column `important` on the `ListToDo` table. All the data in the column will be lost.
  - You are about to drop the column `urgent` on the `ListToDo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ListToDo" DROP COLUMN "complete",
DROP COLUMN "important",
DROP COLUMN "urgent",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isImportant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false;
