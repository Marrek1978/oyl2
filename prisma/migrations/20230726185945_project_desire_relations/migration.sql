/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `Desire` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[desireId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Desire" DROP CONSTRAINT "Desire_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "desireId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Desire_projectId_key" ON "Desire"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_desireId_key" ON "Project"("desireId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE SET NULL ON UPDATE CASCADE;
