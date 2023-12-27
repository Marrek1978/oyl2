import { prisma } from "~/db.server";

import type { Desire, Outcome } from "@prisma/client";
import type { CreateOutcome, UpdateOutcome } from "~/types/outcomeTypes";



export async function createOutcome(outcome: CreateOutcome) {

  try {
    const createOutcome = await prisma.outcome.create({
      data: {
        title: outcome.title,
        description: outcome.description,
        vision: outcome.vision,
        sortOrder: outcome.sortOrder,
        complete: outcome.complete,
        desireId: outcome.desireId,
      },
    });

    return { createOutcome };
  } catch (error) {
    throw error;
  }
}

export async function getOutcomeByOutcomeId(outcomeId: Outcome["id"]) {
  try {
    const outcome = await prisma.outcome.findFirst({
      where: { id: outcomeId },
    });
    return outcome;
  } catch (error) {
    throw error;
  }
}

export async function getOutcomesByDesireId(desireId: Desire["id"]) {
  try {
    const outcomes = await prisma.outcome.findMany({
      where: { desireId },
      orderBy: { sortOrder: "asc" },
    });
    return outcomes;
  } catch (error) {
    throw error;
  }
}

export async function getOutcomeWithMilestonesListsRoutinesHabitsSavingsById(
  outcomeId: Outcome["id"]
) {
  try {
    const outcome = await prisma.outcome.findFirst({
      where: { id: outcomeId },
      include: {
        milestoneGroup: {
          include: { milestones: true },
        },
        lists: true,
        routines: true,
        habits: {
          include: { habitDate: true },
        },
        savings: true,
      },
    });
    return outcome;
  } catch (error) {
    throw error;
  }
}

export async function getAllOutcomesByDesireId(desireId: Desire["id"]) {
  try {
    const outcomes = await prisma.outcome.findMany({
      where: { desireId },
      orderBy: { sortOrder: "asc" },
    });
    return outcomes;
  } catch (error) {
    throw error;
  }
}

export async function updateOutcome(outcome: UpdateOutcome) {
  try {
    const updatedOutcome = await prisma.outcome.update({
      where: { id: outcome.id },
      data: {
        title: outcome.title,
        description: outcome.description,
        vision: outcome.vision,
      },
    });

    return { updatedOutcome };
  } catch (error) {
    throw error;
  }
}

export async function updateOutcomesOrder(outcomes: Outcome[]) {
  try {
    const updatedOutcomes = await outcomes.map((outcome) => {
      return prisma.outcome.update({
        where: { id: outcome.id },
        data: { sortOrder: outcome.sortOrder },
      });
    });
    await Promise.all(updatedOutcomes);
    return updatedOutcomes;
  } catch (error) {
    throw error;
  }
}

export async function deleteOutcomeById(outcomeId: Outcome["id"]) {
  try {
    const deletedOutcome = await prisma.outcome.delete({
      where: { id: outcomeId },
    });
    return deletedOutcome;
  } catch (error) {
    throw error;
  }
}
