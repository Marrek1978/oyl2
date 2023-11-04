import type { ValueWithStringDates } from "./valueTypes";
import type {
  OutcomeWithAll,
  OutcomeWithAllWithStringDates,
  OutcomeWithListsWithStrDates,
  OutcomeWithStringDates,
} from "./outcomeTypes";
import type { Desire, Outcome, Value } from "@prisma/client";
import type { ListAndToDos} from "./listTypes";


export type DesireValues = { desireValues: { value: Value }[] };
export type DesireWithValues = Desire & { desireValues: { value: Value }[] };
export type DesireWithOutcomes = Desire & { outcomes: Outcome[] };

//? string dates
export type DesireWithStringDates = Omit<Desire, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type DesireWithOutcomesWithStringDates = DesireWithStringDates & {
  outcomes: OutcomeWithStringDates[];
};

export type DesireValuesObjWithStringDates = {
  desireValues: { value: ValueWithStringDates }[];
};

export type DesireWithValuesWithStringDates = DesireWithStringDates & {
  desireValues: { value: ValueWithStringDates }[];
};

export type DesireWithValuesAndOutcomesWithStringDates =
  DesireWithValuesWithStringDates & {
    outcomes: OutcomeWithStringDates[];
  };

export type DesireWithOutcomesAndAllWithStrDates = DesireWithStringDates & {
  outcomes: OutcomeWithAllWithStringDates[];
};

export type DesireWithOutcomesAndListsWithStrDates = DesireWithStringDates & {
  outcomes: OutcomeWithListsWithStrDates[]
};

export interface validationErrorsTypes {
  title?: Desire["title"];
  description?: Desire["description"];
}

export type DesireWithOutcomesAndAll = Desire & {
  outcomes: OutcomeWithAll[];
};

export type DesireWithValuesAndOutcomes = Desire & {
  desireValues: { value: Value }[];
} & { outcomes: Outcome[] };

export type DesireWithOutcomesAndLists = Desire & {
  outcomes: Outcome[] & { lists: ListAndToDos[] };
};
