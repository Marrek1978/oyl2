import type { Payments } from "@prisma/client";

export type PaymentsWithStrDates = Omit<
  Payments,
  "createdAt" | "updatedAt" | "paymentDate"
> & {
  createdAt: string;
  updatedAt: string;
  paymentDate: string;
};
