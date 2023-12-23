import type { Savings } from "@prisma/client";



export type SavingsWithStrDates = Omit<Savings, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type CreateSavings = Omit<Savings, "id" | "createdAt" | "updatedAt">;
