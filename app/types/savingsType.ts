import type { Payments, Savings } from "@prisma/client";
import type { PaymentsWithStrDates } from "./paymentsType";

export type SavingsWithStrDates = Omit<Savings, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type CreateSavings = Omit<Savings, "id" | "createdAt" | "updatedAt"> & {
  payment: { amount: number; paymentDate: Date };
};

export type UpdateSavings = {
  title?: string;
  description?: string;
  requiredAmount?: number;
}

export type SavingsAndPaymentsWithStrDates = SavingsWithStrDates & {payments: PaymentsWithStrDates[]};

export type SavingsAndPayments = Savings & {payments: Payments[]};