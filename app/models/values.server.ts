import { prisma } from "~/db.server";
import type { User, Value } from "@prisma/client";

type CreateValue = {
  valueTitle: Value["valueTitle"];
  valueDescription: Value["valueDescription"];
  userId: User["id"];
  sortOrder: Value["sortOrder"];
};

type EditValue = {
  valueTitle: Value["valueTitle"];
  valueDescription: Value["valueDescription"];
  valueId: Value["id"];
};

type DeleteValue = {
  valueId: Value["id"];
};

export const getValues = async (userId: User["id"]) => {
  try {
    const result = await prisma.value.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const createValue = async (value: CreateValue) => {
  try {
    const result = await prisma.value.create({
      data: {
        valueTitle: value.valueTitle,
        valueDescription: value.valueDescription,
        sortOrder: value.sortOrder,
        userId: value.userId,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateValue = async (value: EditValue) => {
  try {
    const result = await prisma.value.update({
      where: {
        id: value.valueId,
      },
      data: {
        valueTitle: value.valueTitle,
        valueDescription: value.valueDescription,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteValue = async (value: DeleteValue) => {
  try {
    const result = await prisma.value.delete({
      where: {
        id: value.valueId,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export async function updateValuesOrder(values: Value[]) {
  try {
    const updateSortOrder = values.map((value) => {
      return prisma.value.update({
        where: { id: value.id },
        data: {
          sortOrder: value.sortOrder,
        },
      });
    });

    await Promise.all(updateSortOrder);
    return { updateSortOrder };
  } catch (error) {
    throw error;
  }
}
