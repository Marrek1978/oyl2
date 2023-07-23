/*
  Warnings:

  - You are about to drop the `DesireValues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Desires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListToDos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoutineToDos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Routines` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Values` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DesireValues" DROP CONSTRAINT "DesireValues_desireId_fkey";

-- DropForeignKey
ALTER TABLE "DesireValues" DROP CONSTRAINT "DesireValues_valueId_fkey";

-- DropForeignKey
ALTER TABLE "Desires" DROP CONSTRAINT "Desires_userId_fkey";

-- DropForeignKey
ALTER TABLE "ListToDos" DROP CONSTRAINT "ListToDos_listId_fkey";

-- DropForeignKey
ALTER TABLE "RoutineToDos" DROP CONSTRAINT "RoutineToDos_routineId_fkey";

-- DropForeignKey
ALTER TABLE "Routines" DROP CONSTRAINT "Routines_userId_fkey";

-- DropForeignKey
ALTER TABLE "Values" DROP CONSTRAINT "Values_userId_fkey";

-- DropTable
DROP TABLE "DesireValues";

-- DropTable
DROP TABLE "Desires";

-- DropTable
DROP TABLE "ListToDos";

-- DropTable
DROP TABLE "RoutineToDos";

-- DropTable
DROP TABLE "Routines";

-- DropTable
DROP TABLE "Values";

-- CreateTable
CREATE TABLE "ListToDo" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "urgent" BOOLEAN NOT NULL,
    "important" BOOLEAN NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ListToDo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineToDo" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "routineId" TEXT NOT NULL,

    CONSTRAINT "RoutineToDo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "valueTitle" TEXT NOT NULL,
    "valueDescription" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desire" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Desire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesireValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "desireId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,

    CONSTRAINT "DesireValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesireValue_valueId_desireId_key" ON "DesireValue"("valueId", "desireId");

-- AddForeignKey
ALTER TABLE "ListToDo" ADD CONSTRAINT "ListToDo_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineToDo" ADD CONSTRAINT "RoutineToDo_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Value" ADD CONSTRAINT "Value_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desire" ADD CONSTRAINT "Desire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireValue" ADD CONSTRAINT "DesireValue_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "Value"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesireValue" ADD CONSTRAINT "DesireValue_desireId_fkey" FOREIGN KEY ("desireId") REFERENCES "Desire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
