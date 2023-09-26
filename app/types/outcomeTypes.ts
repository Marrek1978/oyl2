import type {  Outcome, } from "@prisma/client";

export type NewlyCreatedOutcome = Omit<
   Outcome,
  "createdAt" | "updatedAt"
>;

// export type OutcomeWithProgressList = DesireOutcome & {
//   desireOutcomeProgress: DesireOutcomeProgress[];
// };

//String dates
export type DesireOutcomeWithStringDates = Omit<Outcome,  | 'createdAt' | 'updatedAt'> & {
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