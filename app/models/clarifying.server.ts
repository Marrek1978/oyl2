import { prisma } from "~/db.server";
import type { User, DesiresClarifyingQuestions as DCQ } from "@prisma/client";

interface ClarifyQuestionsInput
  extends Omit<DCQ, "id" | "createdAt" | "updatedAt" | "userId"> {}

interface ClarifyQuestionsInputOptionals {
     birthDate?: Date | null,
    twentyFourHours?: string,
    twentyFourHoursRegrets?: string,
    oneWeek?: string,
    oneWeekRegrets?: string,
    oneMonth?: string,
    oneMonthRegrets?: string,
    oneYear?: string,
    oneYearRegrets?: string,
    fiveYears?: string,
    twentyYears?: string,
    fiftyYears?: string,

}

export const createClarifyingQuestions = async (
  clarifyingQuestions: ClarifyQuestionsInput,
  userId: User["id"]
) => {
  const result = await prisma.desiresClarifyingQuestions.create({
    data: {
      ...clarifyingQuestions,
      userId,
    },
  });

  return result;
};

export const upsertClarifyingQuestions = async (
  clarifyingQuestions: ClarifyQuestionsInputOptionals ,
  userId: User["id"]
) => {
  const result = await prisma.desiresClarifyingQuestions.upsert({
    where: { userId },
    create: {
      ...clarifyingQuestions,
      userId,
    },
    update: {
      ...clarifyingQuestions,
    },
  });

  return result;
};

export const getClarifyingQuestions = async (userId: User["id"]) => {
  const result = await prisma.desiresClarifyingQuestions.findMany({
    where: { userId },
  });

  return result;
};

export const upsertMaxAge = async (maxAge:DCQ['maxAge'], userId:User['id'] ) => {
  const result = await prisma.desiresClarifyingQuestions.upsert({
    where: {userId}, 
    create:{
      userId, 
      maxAge,
    },
    update:{
      maxAge
    },
  })

  return result
}