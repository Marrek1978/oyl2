//create new desireOutcome and DesireOutcomeProgress

import { prisma } from "~/db.server";
import type {
  Desire,
  DesireOutcome,
  // DesireOutcomeProgress,
  User,
} from "@prisma/client";

type CreateOutcome = {
  userId: User["id"];
  title: DesireOutcome["title"];
  description: DesireOutcome["description"];
  sortOrder: DesireOutcome["sortOrder"];
  complete: DesireOutcome["complete"];
  desireId: DesireOutcome["desireId"];
};

export async function createDesireOutcome(
  outcome: CreateOutcome
) {
  try {
    const createOutcome = await prisma.desireOutcome.create({
      data: {
        title: outcome.title,
        description: outcome.description,
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

export async function updateDesireOutcome(
  outcome: DesireOutcome
) {
  try {
    const updatedOutcome = await prisma.desireOutcome.update({
      where: { id: outcome.id },
      data: {
        title: outcome.title,
        description: outcome.description,
        sortOrder: outcome.sortOrder,
        complete: outcome.complete,
        desireId: outcome.desireId,
      },
    });

    return { updatedOutcome };
  } catch (error) {
    throw error;
  }
}






export async function getOutcomesByDesireId(desireId: Desire["id"]) {
  try {
    const outcomes = await prisma.desireOutcome.findMany({
      where: { desireId },
      orderBy: { sortOrder: "asc" },
    });
    return outcomes;
  } catch (error) {
    throw error;
  }
}

export async function getOutcomeByOutcomeId(outcomeId: DesireOutcome["id"]) {
  try{
    const outcome = await prisma.desireOutcome.findFirst({
      where: { id: outcomeId },
    })
    return outcome
  }catch(error){throw error}



}

export async function updateOutcomesOrder(outcomes: DesireOutcome[]) {
  try {
    const updatedOutcomes = await outcomes.map((outcome) => {
      return prisma.desireOutcome.update({
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

export async function deleteOutcomeById(outcomeId: DesireOutcome["id"]) {
  try {
    const deletedOutcome = await prisma.desireOutcome.delete({
      where: { id: outcomeId },
    });
    return deletedOutcome;
  } catch (error) {
    throw error;
  }
}
