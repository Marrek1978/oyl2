import type { Desire, Outcome, Value } from "@prisma/client";
import type { ValueWithStringDates } from "./valueTypes";
import type { DesireOutcomeWithStringDates } from "./outcomeTypes";

export type DesireValues = { desireValues: { value: Value }[] };
export type DesireWithValues = Desire & { desireValues: { value: Value }[] };
export type DesireWithOutcomes = Desire & {outcomes: Outcome[] };

export type DesireWithValuesAndOutcomes = Desire & {
  desireValues: { value: Value }[];
} & {outcomes: Outcome[] };


//string dates
export type DesireWithStringDates = Omit<Desire, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};


export type DesireWithOutcomesWithStringDates = DesireWithStringDates & {
  outcomes: DesireOutcomeWithStringDates[];
};

export type DesireValuesObjWithStringDates = {
  desireValues: { value: ValueWithStringDates }[];
};

export type DesireWithValuesWithStringDates = DesireWithStringDates &
{desireValues: { value: ValueWithStringDates }[]};

export type DesireWithValuesAndOutcomesWithStringDates =
  DesireWithValuesWithStringDates & {
    outcomes: DesireOutcomeWithStringDates[];
  };

export interface validationErrorsTypes {
  title?: Desire["title"];
  description?: Desire["description"];
}
