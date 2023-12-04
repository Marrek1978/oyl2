import { prisma } from "~/db.server";
import type { Habit } from "@prisma/client";
import type { CreateHabit, StreakDataEntriesType } from "~/types/habitTypes";

export const createHabit = async ({
  title,
  description,
  startDate,
  sortOrder,
  outcomeId,
}: CreateHabit) => {
  try {
    const result = await prisma.habit.create({
      data: {
        title,
        description,
        sortOrder,
        outcomeId,
        startDate,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getHabitsByOutcomeId = async (outcomeId: string) => {
  try {
    const habits = await prisma.habit.findMany({
      where: {
        outcomeId: outcomeId,
      },
      orderBy: { sortOrder: "asc" },
    });

    return habits;
  } catch (error) {
    throw error;
  }
};

export const updateHabitsOrder = async (habits: Habit[]) => {
  try {
    const updatedPromises = habits.map((habit) => {
      return prisma.habit.update({
        where: { id: habit.id },
        data: { sortOrder: habit.sortOrder },
      });
    });

    const updatedHabits = await prisma.$transaction(updatedPromises);
    return updatedHabits;
  } catch (error) {
    throw error;
  }
};

export const getHabitById = async (habitId: string) => {
  try {
    return await prisma.habit.findFirst({
      where: {
        id: habitId,
      },
      include: {
        streak: {
          orderBy: { date: "desc" },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const addStreakDates = (streakDataEntries: StreakDataEntriesType[]) => {
  // makes sure that the date (year, month, day) is unique
  try {
    return prisma.streak.createMany({
      data: streakDataEntries,
    });
  } catch (error) {
    throw error;
  }
};
