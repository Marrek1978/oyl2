import type { Desire, Value } from "@prisma/client";

export type DesireWithStringDates = Desire & {
  createdAt: String;
  updatedAt: String;
  desireValues?: { value: Value }[];
};

export type DesireWithValues = Desire & { desireValues: { value: Value }[] };
export type DesireValues = { desireValues: { value: Value }[] }

export interface validationErrorsTypes {
  title?: Desire["title"];
  description?: Desire["description"];
}
