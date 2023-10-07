import { prisma } from "~/db.server";
import type { User, Desire, DesireValue } from "@prisma/client";
import type { DesireWithValues } from "~/types/desireTypes";

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
  try {
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
  } catch (error) {
    throw error;
  }
};

export const getDesireWithValuesAndOutcomes = async (desireId:string) => {
  try {
    const result = await prisma.desire.findFirst({
      where: { id: desireId },
      include: {
        desireValues: {
          select: {
            value: true,
          },
        },
        outcomes: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getDesiresAndOutcomes = async (userId: User["id"]) => {
  try {
    const result = await prisma.desire.findMany({
      where: { userId },
      include: {
        outcomes: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getDesireById = async (
  desireId: Desire["id"],
  userId: User["id"]
) => {
  try {
    const result = await prisma.desire.findFirst({
      where: { id: desireId, userId },
      include: {
        desireValues: {
          select: {
            value: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const getDesiresByUserId = async (userId: User["id"]) => {
  try {
    const result = await prisma.desire.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const createDesire = async (desire: CreateDesire) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

export const updateDesireCurrentSituation = async (
  desireId: Desire["id"],
  current: Desire["current"]
) => {
  try {
    const result = await prisma.desire.update({
      where: {
        id: desireId,
      },
      data: {
        current,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateDesireIdealScenario = async (
  desireId: Desire["id"],
  ideal: Desire["ideal"]
) => {
  try {
    const result = await prisma.desire.update({
      where: {
        id: desireId,
      },
      data: {
        ideal,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateDesire = async (desire: EditDesire) => {
  //delete all existing desireValues
  try {
    await prisma.desireValue.deleteMany({
      where: {
        desireId: desire.id,
      },
    });

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
  } catch (error) {
    throw error;
  }
};

export const updateDesiresOrder = async (desires: DesireWithValues[]) => {
  try {
    const updateSortOrder = desires.map((desire) => {
      return prisma.desire.update({
        where: { id: desire.id },
        data: {  sortOrder: desire.sortOrder },
      });
    });

    await Promise.all(updateSortOrder);
    return { updateSortOrder };
  } catch (error) {
    throw error;
  }
};

export const deleteDesire = async (desireId: DeleteDesire) => {
  try {
    const result = await prisma.desire.delete({
      where: {
        id: desireId.desireId,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
