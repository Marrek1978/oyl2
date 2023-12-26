import type { Payments } from "@prisma/client";

export type CreatePayment = Omit<Payments, "id" | "createdAt" | "updatedAt">;

export type UpdatePayment = {
   amount?: number;
  paymentDate?: Date;
}

export type PaymentWithStrDates = Omit<Payments , "createdAt" | "updatedAt" | "paymentDate"> & {
  createdAt: string;
  updatedAt: string;
  paymentDate: string;
};