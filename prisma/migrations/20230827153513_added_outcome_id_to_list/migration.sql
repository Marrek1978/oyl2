-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_desireId_fkey";

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "outcomeId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
