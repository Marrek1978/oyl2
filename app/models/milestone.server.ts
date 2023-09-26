import { prisma } from "~/db.server";

import type { Milestone } from "@prisma/client";
import type { CreateMilestone } from "~/types/milestoneTypes";



export const getMilestonesByMilestoneGroupId = async (
  milestoneGroupId: string
) => {
  try {
    const milestones = await prisma.milestone.findMany({
      where: {
        milestoneGroupId: milestoneGroupId,
      },
      orderBy: {sortOrder: 'asc'},
    });

    return milestones;
  } catch (error) {
    throw error;
  }
};









export const createMilestone = async (milestone: CreateMilestone) => {
  try {
    const result = await prisma.milestone.create({
      data: {
        title: milestone.title,
        description: milestone.description,
        sortOrder: milestone.sortOrder,
        milestoneGroupId: milestone.milestoneGroupId,
        isComplete: milestone.isComplete,
        completedAt: milestone.completedAt,
        dueDate: milestone.dueDate,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateMilestonesOrder = async (milestones: Milestone[]) => {
  try {
    const updatedMilestones = milestones.map((milestone) => {
      return prisma.milestone.update({
        where: { id: milestone.id },
        data: { sortOrder: milestone.sortOrder },
      });
    });

    await Promise.all(updatedMilestones);
    return { updatedMilestones };
  } catch (error) {
    throw error;
  }
};
