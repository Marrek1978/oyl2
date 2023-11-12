import type { ClarifyingQuestions } from "@prisma/client";

export type ClarifyingQuestionsWithStringDates = ClarifyingQuestions & { birthDate: string, createdAt: string, updatedAt: string }


 