/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `HabitDate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HabitDate_date_key" ON "HabitDate"("date");
