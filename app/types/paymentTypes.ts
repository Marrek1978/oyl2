import type { Payments } from "@prisma/client";

export type CreatePayment = Omit<Payments, "id" | "createdAt" | "updatedAt">;

export type UpdatePayment = {
   amount?: number;
  paymentDate?: Date;
}