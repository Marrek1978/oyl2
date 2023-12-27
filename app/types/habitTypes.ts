import type { Habit, HabitDate } from "@prisma/client";
import type  { HabitDateWithStrDates } from "./habitDateTypes";

export type CreateHabit = Omit<Habit, "id" | "createdAt" | "updatedAt">;
export type UpdateHabit = Omit<Habit, "createdAt" | "updatedAt" | "sortOrder" | "outcomeId">;
export type HabitWithDates = Habit & { habitDate: HabitDate[] };

export type HabitWithStrDates = Omit<
  Habit,
  "createdAt" | "updatedAt" | "startDate"
> & {
  createdAt: string;
  updatedAt: string;
  startDate: string;
};

export type HabitWithDatesWithStrDates = HabitWithStrDates & {
  habitDates: HabitDateWithStrDates[];
};


