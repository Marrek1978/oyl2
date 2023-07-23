import { prisma } from "~/db.server";
import type { User, Value } from "@prisma/client";

type CreateValue = {
  valueTitle: Value["valueTitle"];
  valueDescription: Value['valueDescription'] ;
  userId: User["id"];
  sortOrder: Value["sortOrder"];
};

type EditValue = {
  valueTitle: Value["valueTitle"];
  valueDescription: Value['valueDescription'] ;
  valueId: Value["id"];
};

type DeleteValue = {
  valueId: Value["id"];
};


export const getValues = async (userId: User['id']) => {
  const result = await prisma.value.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

export const createValue = async (value: CreateValue) => {
  const result = await prisma.value.create({
    data: {
      valueTitle: value.valueTitle,
      valueDescription: value.valueDescription,
      sortOrder: value.sortOrder,
      userId: value.userId,
    },
  });

  return result;
};

export const updateValue = async (value: EditValue) => {
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
};

export const deleteValue = async (value: DeleteValue) => {
  const result = await prisma.value.delete({
    where: {
      id: value.valueId,
    },
  });
  return result;
};

export async function updateValuesOrder(values : Value[] ) {
  const updateSortOrder = values.map((value) => {
    return prisma.value.update({
      where: { id: value.id },
      data: {
        sortOrder: value.sortOrder ,
      },
    });
  });

  await Promise.all(updateSortOrder);
  return { updateSortOrder };
}
