import type { Value } from "@prisma/client";

export type ValuesWithStringDates = Value & { createdAt: String, updatedAt: String }


export interface validationErrorsTypes {
  title?: Value['valueTitle']
  description?: Value['valueDescription']
}