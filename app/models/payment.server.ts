import { prisma } from "~/db.server";

import type { Payments } from "@prisma/client";
import type { CreatePayment, UpdatePayment } from "~/types/paymentTypes";
import { currStringToNum } from "~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings";

export const createPayment = async (
  payment: CreatePayment
): Promise<Payments | null> => {
  try {
    const result = await prisma.payments.create({
      data: payment,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const updatePayment = async (
  id: string,
  payment: UpdatePayment
): Promise<Payments | null> => {
  const paymentObj: UpdatePayment = {};

  if (payment.amount)
    paymentObj.amount = currStringToNum(payment.amount.toString()) as number;

  if (payment.paymentDate)
    paymentObj.paymentDate = new Date(payment.paymentDate);

  try {
    const result = await prisma.payments.update({
      where: { id },
      data: paymentObj,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deletePayment = async (id: string) => {
  try {
    const result = await prisma.payments.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
