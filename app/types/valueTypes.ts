import type { Values } from "@prisma/client";

export type ValuesWithStringDates = Values & { createdAt: String, updatedAt: String }


export interface validationErrorsTypes {
  title?: Values['valueTitle']
  description?: Values['valueDescription']
}