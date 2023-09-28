import { prisma } from "~/db.server";

import type { Milestone } from "@prisma/client";
import type { CreateMilestone } from "~/types/milestoneTypes";

//milestons

export const createMilestone = async (milestone: CreateMilestone) => {
  console.log(" in server func and milestone is ", milestone);
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

export const getMilestoneById = async (milestoneId: string) => {
  try {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });
    return milestone;
  } catch (error) {
    throw error;
  }
};

export const getMilestonesByMilestoneGroupId = async (
  milestoneGroupId: string
) => {
  try {
    const milestones = await prisma.milestone.findMany({
      where: {
        milestoneGroupId: milestoneGroupId,
      },
      orderBy: { sortOrder: "asc" },
    });

    return milestones;
  } catch (error) {
    throw error;
  }
};

export const updateMilestone = async (milestone: Milestone) => {
  try {
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestone.id },
      data: milestone,
    });
    return { updatedMilestone };
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

export const updateMilestoneCompleted = async (milestone: Milestone) => {
  try {
    const result = await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        isComplete: milestone.isComplete,
        completedAt: milestone.completedAt,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteMilestoneById = async (milestoneId: string) => {
  try {
    const milestone = await prisma.milestone.delete({
      where: { id: milestoneId },
    });
    return milestone;
  } catch (error) {
    throw error;
  }
};
