import type { Value } from "@prisma/client";


export type ValueWithStringDates = Omit<Value, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};


