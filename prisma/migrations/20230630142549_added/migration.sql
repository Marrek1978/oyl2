-- CreateTable
CREATE TABLE "Routines" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineToDos" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "routineId" TEXT NOT NULL,

    CONSTRAINT "RoutineToDos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Routines" ADD CONSTRAINT "Routines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineToDos" ADD CONSTRAINT "RoutineToDos_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
