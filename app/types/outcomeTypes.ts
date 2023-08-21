import type { DesireOutcome, } from "@prisma/client";

export type NewlyCreatedOutcome = Omit<
  DesireOutcome,
  "createdAt" | "updatedAt"
>;

// export type OutcomeWithProgressList = DesireOutcome & {
//   desireOutcomeProgress: DesireOutcomeProgress[];
// };

//String dates
export type DesireOutcomeWithStringDates = Omit<DesireOutcome, "dueDate" | 'createdAt' | 'updatedAt'> & {
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

// export type DesireOutcomeProgressWithStringDates = Omit<DesireOutcomeProgress, "dueDate" | 'createdAt' | 'updatedAt'> & {
//   dueDate: string;
//   createdAt: string;
//   updatedAt: string;
// };

// export type OutcomeWithProgessWithStringDates = DesireOutcomeWithStringDates & {
//   desireOutcomeProgress: DesireOutcomeProgressWithStringDates[];
// };