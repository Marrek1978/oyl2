import { prisma } from "~/db.server";

import type { MilestoneGroup } from "@prisma/client";
import { UpdateMilestoneGroup } from "~/types/milestoneTypes";

type CreateMilestoneGroup = Omit<
  MilestoneGroup,
  "id" | "createdAt" | "updatedAt"
>;

export const createMilestoneGroup = async (
  milestoneGroup: CreateMilestoneGroup
) => {
  try {
    const result = await prisma.milestoneGroup.create({
      data: {
        title: milestoneGroup.title,
        description: milestoneGroup.description,
        sortOrder: milestoneGroup.sortOrder,
        outcomeId: milestoneGroup.outcomeId,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const getMilestoneGroupsByOutcomeId = async (outcomeId: string) => {
  try {
    const milestoneGroups = await prisma.milestoneGroup.findMany({
      where: {
        outcomeId: outcomeId,
      },
      include: {
        milestones: true,
      },
    });

    return milestoneGroups;
  } catch (error) {
    throw error;
  }
};

export const getMilestoneGroupById = async (id: string) => {
  try {
    const milestoneGroup = await prisma.milestoneGroup.findUnique({
      where: {
        id: id,
      },
    });

    return milestoneGroup;
  } catch (error) {
    throw error;
  }
};

export const updateMilestoneGroupById = async (
  milestoneGroup: UpdateMilestoneGroup
) => {
  console.log("in server file and milestoneGroup", milestoneGroup);
  try {
    const result = await prisma.milestoneGroup.update({
      where: { id: milestoneGroup.id },
      data: {
        title: milestoneGroup.title,
        description: milestoneGroup.description,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateGroupsOrder = async (groups: MilestoneGroup[]) => {
  try {
    const updatedGroups = groups.map((group) => {
      return prisma.milestoneGroup.update({
        where: { id: group.id },
        data: { sortOrder: group.sortOrder },
      });
    });

    await Promise.all(updatedGroups);
    return { updatedGroups };
  } catch (error) {
    throw error;
  }
};

export const getMilestoneGroupAndItsMilesonesById = async (id: string) => {
  try {
    const milestoneGroup = await prisma.milestoneGroup.findUnique({
      where: {
        id: id,
      },
      include: {
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return milestoneGroup;
  } catch (error) {
    throw error;
  }
};

export const deleteMilestoneGroupById = async (id: string) => {
  try {
    const result = await prisma.milestoneGroup.delete({
      where: {
        id: id,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};
