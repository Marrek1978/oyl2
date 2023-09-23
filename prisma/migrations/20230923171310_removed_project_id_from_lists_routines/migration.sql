/*
  Warnings:

  - You are about to drop the column `projectId` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Routine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_projectId_fkey";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "projectId";
