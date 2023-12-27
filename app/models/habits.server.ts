import { prisma } from "~/db.server";

import type { Habit } from "@prisma/client";
import type { CreateHabitDate } from "~/types/habitDateTypes";
import type { CreateHabit, UpdateHabit } from "~/types/habitTypes";

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

export const updateHabit = async (habit: UpdateHabit) => {
  try {
    const result = await prisma.habit.update({
      where: { id: habit.id },
      data: {
        title: habit.title,
        description: habit.description,
        startDate: habit.startDate,
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
        habitDate: {
          orderBy: { date: "desc" },
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const addHabitDates = (habitDates: CreateHabitDate[]) => {
  console.log('habitDates', habitDates)
  // makes sure that the date (year, month, day) is unique
  try {
    const result =  prisma.habitDate.createMany({
      data: habitDates,
    });
    console.log("🚀 ~ file: habits.server.ts:101 ~ addHabitDates ~ result:", result)
    return result
  } catch (error) {
    console.log("🚀 ~ file: habits.server.ts:102 ~ addHabitDates ~ error:", error)
    throw error;
  }
};

export const updateHabitDateSuccessById = ({
  id,
  isSuccess,
}: {
  id: string;
  isSuccess: boolean;
}) => {
  try {
    return prisma.habitDate.update({
      where: { id },
      data: { isSuccess },
    });
  } catch (error) {
    throw error;
  }
};
