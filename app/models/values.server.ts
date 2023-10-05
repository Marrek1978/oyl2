import { prisma } from "~/db.server";
import type { User, Value } from "@prisma/client";

type CreateValue = {
  title: Value["title"];
  description: Value["description"];
  userId: User["id"];
  sortOrder: Value["sortOrder"];
};

type EditValue = {
  title: Value["title"];
  description: Value["description"];
  id: Value["id"];
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
        title: value.title,
        description: value.description,
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
        id: value.id,
      },
      data: {
        title: value.title,
        description: value.description,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteValue = async (id: string) => {
  console.log('value in deleteValue', id)
  try {
    const result = await prisma.value.delete({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export async function updateValuesOrder(values: Value[]) {
  console.log("in server function and values", values);
  try {
    const updatePromises = values.map((value) => {
      return prisma.value.update({
        where: { id: value.id },
        data: {
          sortOrder: value.sortOrder,
        },
      });
    });

    const updatedValues = await prisma.$transaction(updatePromises);
    return updatedValues;
  } catch (error) {
    throw error;
  }
}
