import type { Streak } from "@prisma/client";

export type StreakWithStrDates = Omit<Streak, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};