import type { Habit, Streak } from "@prisma/client";

export type CreateHabit = Omit<Habit, "id" | "createdAt" | "updatedAt">;
export type HabitWithStreaks = Habit & {streaks: Streak[]};