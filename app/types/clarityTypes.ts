import type { DesiresClarifyingQuestions } from "@prisma/client";

export type ClarifyingQuestionsWithStringDates = DesiresClarifyingQuestions & { birthDate: string, createdAt: string, updatedAt: string }


 