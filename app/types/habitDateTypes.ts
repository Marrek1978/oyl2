import type { HabitDate } from "@prisma/client";


export type HabitDateWithStrDates = Omit<HabitDate, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type CreateHabitDate = {
  date: Date;
  isSuccess: boolean;
  habitId: string;
};