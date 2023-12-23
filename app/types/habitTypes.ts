import type { Habit, Streak  } from "@prisma/client";

export type CreateHabit = Omit<Habit, "id" | "createdAt" | "updatedAt">;
export type HabitWithStreaks = Habit & { streak: Streak[] };

export type StreakDataEntriesType = {
  date: Date
  isSuccess: boolean;
  habitId: string;
};


// export type HabitsWithStrDates = Omit<HabitTracker, "createdAt" | "updatedAt"> & {
//   createdAt: string;
//   updatedAt: string;
// };
