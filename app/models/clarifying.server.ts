import { prisma } from "~/db.server";
import type {
  User,
  ClarifyingQuestions as CQ,
  ClarifyingQuestions,
} from "@prisma/client";

interface ClarifyQuestionsInput
  extends Omit<CQ, "id" | "createdAt" | "updatedAt" | "userId"> {}

interface ClarifyQuestionsFromApp {
  birthDate?: Date | null;
  twentyFourHours?: string;
  twentyFourHoursRegrets?: string;
  oneWeek?: string;
  oneWeekRegrets?: string;
  oneMonth?: string;
  oneMonthRegrets?: string;
  oneYear?: string;
  oneYearRegrets?: string;
  fiveYears?: string;
  twentyYears?: string;
  fiftyYears?: string;
  maxAge?: number | null | undefined;
}

export const createClarifyingQuestions = async (
  clarifyingQuestions: ClarifyQuestionsInput,
  userId: User["id"]
) => {
  const result = await prisma.clarifyingQuestions.create({
    data: {
      ...clarifyingQuestions,
      userId,
    },
  });

  return result;
};

export const upsertClarifyingQuestions = async (
  clarifyingQuestions: ClarifyQuestionsFromApp,
  userId: User["id"]
) => {
  console.log(
    "🚀 ~ file: clarifying.server.ts:57 ~ clarifyingQuestions:",
    clarifyingQuestions
  );

  const updateData = {
    ...clarifyingQuestions,
    userId,
  };

  const result = await prisma.clarifyingQuestions.upsert({
    where: { userId },
    create: updateData,
    update: updateData,
  });

  return result;
};

export const getClarifyingQuestions = async (userId: User["id"]) => {
  return await prisma.clarifyingQuestions.findMany({
    where: { userId },
  });
};

export const getMonthlyAmount = async (userId: User["id"]) => {
  const result = await prisma.clarifyingQuestions.findUnique({
    where: { userId },
  });

  return result?.monthlyAmount;
};

export const upsertMaxAge = async (
  maxAge: CQ["maxAge"],
  userId: User["id"]
) => {
  const result = await prisma.clarifyingQuestions.upsert({
    where: { userId },
    create: {
      userId,
      maxAge,
    },
    update: {
      maxAge,
    },
  });

  return result;
};

export const getClarifyingQIdForUserByUserId = async (userId: User["id"]) => {
  const result = await prisma.clarifyingQuestions.findUnique({
    where: { userId },
  });
  const id = result?.id;
  return id;
};

export const updateMonthlySavingsAmount = async ({
  monthlyAmount,
  id,
}: { monthlyAmount: ClarifyingQuestions["monthlyAmount"] } & {
  id: ClarifyingQuestions["id"];
}) => {
  try {
    const result = await prisma.clarifyingQuestions.update({
      where: { id },
      data: { monthlyAmount },
    });

    return result;
  } catch (error) {
    throw error;
  }
};
