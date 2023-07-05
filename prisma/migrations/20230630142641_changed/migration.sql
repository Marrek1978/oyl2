/*
  Warnings:

  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_userId_fkey";

-- DropForeignKey
ALTER TABLE "ToDo" DROP CONSTRAINT "ToDo_listId_fkey";

-- DropTable
DROP TABLE "List";

-- CreateTable
CREATE TABLE "Lists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lists" ADD CONSTRAINT "Lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToDo" ADD CONSTRAINT "ToDo_listId_fkey" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
