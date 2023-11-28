import { prisma } from "~/db.server";
import type { User, ClarifyingQuestions as CQ } from "@prisma/client";

interface ClarifyQuestionsInput
  extends Omit<CQ, "id" | "createdAt" | "updatedAt" | "userId"> {}

interface ClarifyQuestionsInputOptionals {
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
  maxAge?: string;
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
  clarifyingQuestions: ClarifyQuestionsInputOptionals,
  userId: User["id"]
) => {
  // let maxAgeNum =
  //   clarifyingQuestions.maxAge !== undefined
  //     ? Number(clarifyingQuestions.maxAge)
  //     : undefined;

  const result = await prisma.clarifyingQuestions.upsert({
    where: { userId },
    create: {
      ...clarifyingQuestions,
      maxAge: Number( clarifyingQuestions.maxAge),
      userId,
    },
    update: {
      ...clarifyingQuestions,
      maxAge: Number( clarifyingQuestions.maxAge),
    },
  });

  return result;
};

export const getClarifyingQuestions = async (userId: User["id"]) => {
  return await prisma.clarifyingQuestions.findMany({
    where: { userId },
  });
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
