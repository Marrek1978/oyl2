import type { SavingsTracker } from "@prisma/client";



export type SavingsWithStrDates = Omit<SavingsTracker, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
