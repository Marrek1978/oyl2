import { prisma } from "~/db.server";
import type { User, Values } from "@prisma/client";

type CreateValue = {
  valueTitle: Values["valueTitle"];
  valueDescription: Values['valueDescription'] ;
  userId: User["id"];
  sortOrder: Values["sortOrder"];
};

type EditValue = {
  valueTitle: Values["valueTitle"];
  valueDescription: Values['valueDescription'] ;
  valueId: Values["id"];
};

type DeleteValue = {
  valueId: Values["id"];
};


export const getValues = async (userId: User['id']) => {
  const result = await prisma.values.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

export const createValue = async (value: CreateValue) => {
  const result = await prisma.values.create({
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
  const result = await prisma.values.update({
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
  const result = await prisma.values.delete({
    where: {
      id: value.valueId,
    },
  });
  return result;
};

export async function updateValuesOrder(values : Values[] ) {
  const updateSortOrder = values.map((value) => {
    return prisma.values.update({
      where: { id: value.id },
      data: {
        sortOrder: value.sortOrder ,
      },
    });
  });

  await Promise.all(updateSortOrder);
  return { updateSortOrder };
}
