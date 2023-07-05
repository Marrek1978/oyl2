import type { Desires, Values } from "@prisma/client";

export type DesireWithStringDates = Desires & { createdAt: String, updatedAt: String }

export type DesireWithValues = Desires & {desireValues: {value: Values}[]}

export interface validationErrorsTypes {
  title?: Desires['title']
  description?: Desires['description']
}