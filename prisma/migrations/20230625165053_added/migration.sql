-- CreateTable
CREATE TABLE "Desires" (
    "id" TEXT NOT NULL,
    "desireTitle" TEXT NOT NULL,
    "desireDescription" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Desires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesireValues" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "desireId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,

    CONSTRAINT "DesireValues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesireValues_valueId_desireId_key" ON "DesireValues"("valueId", "desireId");

-- AddForeignKey
ALTER TABLE "Desires" ADD CONSTRAINT "Desires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireValues" ADD CONSTRAINT "DesireValues_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireValues" ADD CONSTRAINT "DesireValues_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
