import type { DesireOutcome, DesireOutcomeProgress } from "@prisma/client";




export type NewlyCreatedOutcome = Omit<DesireOutcome, 'createdAt' | 'updatedAt'>  

export type OutcomeWithProgressList = DesireOutcome & { desireOutcomeProgress
  : DesireOutcomeProgress[] }