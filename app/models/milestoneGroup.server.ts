import { prisma } from "~/db.server";

import type { MilestoneGroup } from "@prisma/client";

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
}




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

