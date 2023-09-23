-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "outcomeId" TEXT,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MilestoneItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "milestoneId" TEXT,

    CONSTRAINT "MilestoneItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "DesireOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestoneItem" ADD CONSTRAINT "MilestoneItem_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
