import type { HabitTracker } from "@prisma/client";



export type HabitsWithStrDates = Omit<HabitTracker, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
