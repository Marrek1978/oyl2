-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "outcomeId" TEXT;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
