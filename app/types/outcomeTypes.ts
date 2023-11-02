import type { Outcome } from "@prisma/client";
import type { HabitsWithStrDates } from "./habitsType";
import type { ListAndToDos, ListWithStrDates } from "~/types/listTypes";
import type { SavingsWithStrDates } from "~/types/savingsType";
import type {
  RoutineAndTasks,
  RoutineWithStrDates,
} from "~/types/routineTypes";
import type { MilestoneGroupsWithStrDates } from "~/types/milestoneTypes";

export type NewlyCreatedOutcome = Omit<Outcome, "createdAt" | "updatedAt">;

//String dates
export type OutcomeWithStringDates = Omit<
  Outcome,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type OutcomeWithAllWithStringDates = OutcomeWithStringDates & {
  milestoneGroup: MilestoneGroupsWithStrDates[];
} & { lists: ListWithStrDates[] } & { routines: RoutineWithStrDates[] } & {
  savingsTrackers: SavingsWithStrDates[];
} & { habitTrackers: HabitsWithStrDates[] };

export type OutcomeWithAll = Outcome & { lists: ListAndToDos[] } & {
  routines: RoutineAndTasks[];
};
