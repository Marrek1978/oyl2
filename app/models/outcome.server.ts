//create new desireOutcome and DesireOutcomeProgress

import { prisma } from "~/db.server";
import type {
  Desire,
  DesireOutcome,
  // DesireOutcomeProgress,
  User,
} from "@prisma/client";
import type { NewlyCreatedProgress } from "~/types/progressTypes";

type CreateOutcomeWithProgressList = {
  userId: User["id"];
  title: DesireOutcome["title"];
  description: DesireOutcome["description"];
  sortOrder: DesireOutcome["sortOrder"];
  dueDate: DesireOutcome["dueDate"];
  complete: DesireOutcome["complete"];
  desireId: DesireOutcome["desireId"];
  progressList: NewlyCreatedProgress[] | [];
};

export async function createDesireOutcomeAndProgressList(
  outcome: CreateOutcomeWithProgressList
) {
  try {
   const createOutcome = await prisma.desireOutcome.create({
      data: {
        title: outcome.title,
        description: outcome.description,
        sortOrder: outcome.sortOrder,
        dueDate: outcome.dueDate,
        complete: outcome.complete,
        desireId: outcome.desireId,
      }})

      const progress = await outcome.progressList.map((progress) => {
        return prisma.desireOutcomeProgress.create({
          data:  { 
            title: progress.title,
            description: progress.description,
            sortOrder: progress.sortOrder,
            dueDate: progress.dueDate,
            complete: progress.complete,
            desireOutcomeId: createOutcome.id
          }
        });
      })

      await Promise.all(progress)
      return { createOutcome, progress };
  } catch (error) {
    throw error;
  }
}


export async function getOutcomesByDesireId(desireId: Desire["id"]) {
  try {
    const outcomes = await prisma.desireOutcome.findMany({
      where: { desireId },
      include: { desireOutcomeProgress: true },
    });
    return outcomes;
  } catch (error) {
    throw error;
  }
}