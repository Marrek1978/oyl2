import { prisma } from "~/db.server";
import type { Savings } from "@prisma/client";

import type {
  CreateSavings,
  SavingsAndPayments,
  UpdateSavings,
} from "~/types/savingsType";
import { currStringToNum } from "~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings";

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
    throw error;
  }
};

export const updateSaving = async ({
  id,
  title,
  description,
  requiredAmount,
}: { id: string } & UpdateSavings) => {
  
  const dataObject:UpdateSavings = {};
  if (title) {
    dataObject.title = title as string;
  }
  if (description) {
    dataObject.description = description as string;
  }
  if (requiredAmount) {
    dataObject.requiredAmount = currStringToNum(requiredAmount.toString()) as number;
  }

  try {
    const result = await prisma.savings.update({
      where: { id },
      data: dataObject,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getSavingsWithPaymentsByOutcomeId = async (
  outcomeId: string
): Promise<SavingsAndPayments[] | null> => {
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

export const getSavingWithPaymentsById = async (
  savingId: string
): Promise<SavingsAndPayments | null> => {
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

export const getSavingById = async (
  savingId: string
): Promise<Savings | null> => {
  try {
    const result = await prisma.savings.findFirst({
      where: { id: savingId },
    });

    return result;
  } catch (error) {
    throw error;
  }
};


export const deleteSaving = async (savingId: string) => { 
  console.log(' in server func')
  try {
    const result = await prisma.savings.delete({
      where: { id: savingId },
    });
    console.log("🚀 ~ file: saving.server.ts:134 ~ deleteSaving ~ result:", result)
    return result;
  } catch (error) {
    console.log("🚀 ~ file: saving.server.ts:137 ~ deleteSaving ~ error:", error)
    throw error;
  }
}
