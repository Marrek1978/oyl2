import type { DesiresClarifyingQuestions } from "@prisma/client";

export type ClarifyingQuestionsWithStringDates = DesiresClarifyingQuestions & { birthDate: string, createdAt: string, updatedAt: string }


export interface validationErrorsTypes {
  // title?: Desires['title']
  // description?: Desires['description']
}