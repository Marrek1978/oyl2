import type { Habit, Streak } from "@prisma/client";
import type { StreakWithStrDates } from "./streakTypes";

export type CreateHabit = Omit<Habit, "id" | "createdAt" | "updatedAt">;
export type HabitWithStreaks = Habit & { streak: Streak[] };

export type HabitWithStrDates = Omit<
  Habit,
  "createdAt" | "updatedAt" | "startDate"
> & {
  createdAt: string;
  updatedAt: string;
  startDate: string;
};

export type HabitWithStreaksWithStrDates = HabitWithStrDates & {
  streak: StreakWithStrDates[];
};

export type StreakDataEntriesType = {
  date: Date;
  isSuccess: boolean;
  habitId: string;
};
