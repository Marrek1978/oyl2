import { prisma } from "~/db.server";
import type { Savings } from "@prisma/client";

import type { CreateSavings, SavingsAndPayments } from "~/types/savingsType";

export const createSaving = async ({
  title,
  description,
  sortOrder,
  requiredAmount,
  outcomeId,
  payment,
}: CreateSavings) => {
  try {
    const result = await prisma.savings.create({
      data: {
        title,
        description,
        sortOrder,
        requiredAmount,
        outcomeId,
        payments: {
          create: payment,
        },
      },
    });
    return result;
  } catch (error) {
    console.log("🚀 ~ file: saving.server.ts:32 ~ error:", error);
    throw error;
  }
};

export const getSavingsWithPaymentsByOutcomeId = async (outcomeId: string):Promise<SavingsAndPayments[] | null> => {
  try {
    const result = await prisma.savings.findMany({
      where: { outcomeId: outcomeId },
      include: { payments: true },
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

export const getSavingWithPaymentsById = async (savingId: string):Promise<SavingsAndPayments | null> => {
  try {
    const result = await prisma.savings.findFirst({
      where: { id: savingId },
      include: { payments: true },
    });

    return result;
  } catch (error) {
    throw error;
  }
};
