import { prisma } from "~/db.server";
import type { Savings } from "@prisma/client";

import type { CreateSavings } from "~/types/savingsType";

export const createSaving = async ({
  title,
  description,
  sortOrder,
  requiredAmount,
  savedAmount,
  outcomeId,
}: CreateSavings) => {
  try {
    const result = await prisma.savings.create({
      data: {
        title,
        description,
        sortOrder,
        requiredAmount,
        savedAmount,
        outcomeId,
      },
    });
    return result;
  } catch (error) {
    console.log("🚀 ~ file: saving.server.ts:32 ~ error:", error);
    throw error;
  }
};

export const getSavingsByOutcomeId = async (outcomeId: string) => {
  try {
    const result = await prisma.savings.findMany({
      where: {
        outcomeId: outcomeId,
      },
      orderBy: { sortOrder: "asc" },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateSavingsOrder = async (savings: Savings[]) => {
  try {
    const updatedPromises = savings.map((saving) => {
      return prisma.savings.update({
        where: { id: saving.id },
        data: { sortOrder: saving.sortOrder },
      });
    });

    const updatedSavings = await prisma.$transaction(updatedPromises);
    return updatedSavings;
  } catch (error) {
    throw error;
  }
};

export const getSavingById = async (savingId: string) => {
  try {
    const result = await prisma.savings.findFirst({
      where: { id: savingId },
    });

    return result;
  } catch (error) {
    throw error;
  }
}