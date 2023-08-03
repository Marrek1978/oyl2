import type { DesireOutcomeProgress } from "@prisma/client";




export type NewlyCreatedProgress = Omit<DesireOutcomeProgress, 'createdAt' | 'updatedAt'>  