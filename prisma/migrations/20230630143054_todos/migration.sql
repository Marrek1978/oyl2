/*
  Warnings:

  - You are about to drop the `ToDo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_listId_fkey";

-- DropTable
DROP TABLE "ToDo";

-- CreateTable
CREATE TABLE "ListToDos" (
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

    CONSTRAINT "ListToDos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListToDos" ADD CONSTRAINT "ListToDos_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
