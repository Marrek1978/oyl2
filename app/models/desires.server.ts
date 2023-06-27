import { prisma } from "~/db.server";
import type { User, Desires, DesireValues } from "@prisma/client";
import { DesireWithValues } from "~/types/desireTypes";

type CreateDesire = {
  title: Desires["title"];
  description: Desires["description"];
  userId: User["id"];
  sortOrder: Desires["sortOrder"];
  valueIds: DesireValues["valueId"][];
};

type EditDesire = {
  id: Desires["id"];
  title: Desires["title"];
  description: Desires["description"];
  valueIds: DesireValues["valueId"][];
};

type DeleteDesire = {
  desireId: Desires["id"];
};

export const getDesires = async (userId: User["id"]) => {
  const result = await prisma.desires.findMany({
    where: { userId },
    include: {
      desireValues: {
        select: {
          value: true,
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

export const createDesire = async (desire: CreateDesire) => {
  const result = await prisma.desires.create({
    data: {
      title: desire.title,
      description: desire.description,
      sortOrder: desire.sortOrder,
      userId: desire.userId,
      desireValues: {
        create: desire.valueIds.map((valueId) => ({
          value: { connect: { id: valueId } },
        })),
      },
    },
  });

  return result;
};

export const updateDesire = async (desire: EditDesire) => {
  //delete all existing desireValues
  try {
    await prisma.desireValues.deleteMany({
      where: {
        desireId: desire.id,
      },
    });
  } catch (error) {
    throw error;
  }

  const result = await prisma.desires.update({
    where: {
      id: desire.id,
    },
    data: {
      title: desire.title,
      description: desire.description,
      desireValues: {
        create: desire.valueIds.map((valueId) => ({
          value: { connect: { id: valueId } },
        })),
      },
    },
  });

  return result;
};

export const updateDesiresOrder = async (desires: DesireWithValues[]) => {
  const updateSortOrder = desires.map((desire) => {
    return prisma.desires.update({
      where: { id: desire.id },
      data: {
        sortOrder: desire.sortOrder,
      },
    });
  });

  await Promise.all(updateSortOrder);
  return { updateSortOrder };
}

export const deleteDesire = async (desireId: DeleteDesire) => {

  const result = await prisma.desires.delete({
    where:{
      id: desireId.desireId
    }
  })
  return result;
}