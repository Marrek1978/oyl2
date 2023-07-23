import { prisma } from "~/db.server";
import type { User, Desire, DesireValue } from "@prisma/client";
import { DesireWithValues } from "~/types/desireTypes";

type CreateDesire = {
  title: Desire["title"];
  description: Desire["description"];
  userId: User["id"];
  sortOrder: Desire["sortOrder"];
  valueIds: DesireValue["valueId"][];
};

type EditDesire = {
  id: Desire["id"];
  title: Desire["title"];
  description: Desire["description"];
  valueIds: DesireValue["valueId"][];
};

type DeleteDesire = {
  desireId: Desire["id"];
};

export const getDesires = async (userId: User["id"]) => {
  const result = await prisma.desire.findMany({
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
  const result = await prisma.desire.create({
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
    await prisma.desireValue.deleteMany({
      where: {
        desireId: desire.id,
      },
    });
  } catch (error) {
    throw error;
  }

  const result = await prisma.desire.update({
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
    return prisma.desire.update({
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

  const result = await prisma.desire.delete({
    where:{
      id: desireId.desireId
    }
  })
  return result;
}