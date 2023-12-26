import type {
  ListAndToDos,
  ListAndTodosWithStrDates,
  ListWithStrDates,
} from "~/types/listTypes";

import type {
  RoutineAndTasks,
  RoutineWithStrDates,
} from "~/types/routineTypes";

import type { Outcome } from "@prisma/client";
import type { SavingsWithStrDates } from "~/types/savingsType";
import type { HabitWithStreaksWithStrDates } from "~/types/habitTypes";
import type { MilestoneGroupsWithMilestonesWithStringDates } from "~/types/milestoneTypes";


export type NewlyCreatedOutcome = Omit<Outcome, "createdAt" | "updatedAt">;

//String dates
export type OutcomeWithStringDates = Omit<
  Outcome,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type OutcomeWithListsWithStrDates = OutcomeWithStringDates & {
  lists: ListAndTodosWithStrDates[];
};

export type OutcomeWithAllWithStringDates = OutcomeWithStringDates & {
  milestoneGroup: MilestoneGroupsWithMilestonesWithStringDates[];
} & {
  lists: ListWithStrDates[];
} & {
  routines: RoutineWithStrDates[];
} & {
  savings: SavingsWithStrDates[];
} & {
  habits: HabitWithStreaksWithStrDates[];
};

export type OutcomeWithAll = Outcome & { lists: ListAndToDos[] } & {
  routines: RoutineAndTasks[];
};

export type OutcomeWithLists = Outcome & { lists: ListAndToDos[] };
