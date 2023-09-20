import type { Desire, DesireOutcome, Value } from "@prisma/client";
import type { ValueWithStringDates } from "./valueTypes";
import type { DesireOutcomeWithStringDates } from "./outcomeTypes";

export type DesireValues = { desireValues: { value: Value }[] };
export type DesireWithValues = Desire & { desireValues: { value: Value }[] };
export type DesireWithOutcomes = Desire & { desireOutcomes: DesireOutcome[] };

export type DesireWithValuesAndOutcomes = Desire & {
  desireValues: { value: Value }[];
} & { desireOutcomes: DesireOutcome[] };


//string dates
export type DesireWithStringDates = Omit<Desire, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};


export type DesireWithOutcomesWithStringDates = DesireWithStringDates & {
  desireOutcomes: DesireOutcomeWithStringDates[];
};

export type DesireValuesObjWithStringDates = {
  desireValues: { value: ValueWithStringDates }[];
};

export type DesireWithValuesWithStringDates = DesireWithStringDates &
{desireValues: { value: ValueWithStringDates }[]};

export type DesireWithValuesAndOutcomesWithStringDates =
  DesireWithValuesWithStringDates & {
    desireOutcomes: DesireOutcomeWithStringDates[];
  };

export interface validationErrorsTypes {
  title?: Desire["title"];
  description?: Desire["description"];
}
