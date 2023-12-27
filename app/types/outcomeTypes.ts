import type {
  ListAndToDos,
  ListAndTodosWithStrDates,
  ListWithStrDates,
} from "~/types/listTypes";

import type {
  RoutineAndTasks,
  RoutineWithStrDates,
} from "~/types/routineTypes";

import type { Outcome, User } from "@prisma/client";
import type { SavingsWithStrDates } from "~/types/savingsType";
import type  { HabitWithDatesWithStrDates } from "./habitTypes";
import type { MilestoneGroupsWithMilestonesWithStringDates } from "~/types/milestoneTypes";


export type CreateOutcome = Omit<Outcome, "id" | "createdAt" | "updatedAt"> & {
  userId: User["id"];
};

export type UpdateOutcome = Omit<
  Outcome,
  "createdAt" | "updatedAt" | "sortOrder" | "complete" | "desireId"
>;

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
  habits: HabitWithDatesWithStrDates[];
};

export type OutcomeWithAll = Outcome & { lists: ListAndToDos[] } & {
  routines: RoutineAndTasks[];
};

export type OutcomeWithLists = Outcome & { lists: ListAndToDos[] };
