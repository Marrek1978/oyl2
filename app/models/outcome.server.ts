//create new desireOutcome and DesireOutcomeProgress

import { prisma } from "~/db.server";
import type {
  Desire,
  DesireOutcome,
  // DesireOutcomeProgress,
  User,
} from "@prisma/client";
import type { NewlyCreatedProgress } from "~/types/progressTypes";
import type { OutcomeWithProgressList } from "~/types/outcomeTypes";

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
      },
    });

    const progress = await outcome.progressList.map((progress) => {
      return prisma.desireOutcomeProgress.create({
        data: {
          title: progress.title,
          description: progress.description,
          sortOrder: progress.sortOrder,
          dueDate: progress.dueDate,
          complete: progress.complete,
          desireOutcomeId: createOutcome.id,
        },
      });
    });

    await Promise.all(progress);
    return { createOutcome, progress };
  } catch (error) {
    throw error;
  }
}

export async function updateDesireOutcomeAndProgressList(
  outcome: OutcomeWithProgressList
) {
  try {
    const updatedOutcome = await prisma.desireOutcome.update({
      where: { id: outcome.id },
      data: {
        title: outcome.title,
        description: outcome.description,
        sortOrder: outcome.sortOrder,
        dueDate: outcome.dueDate,
        complete: outcome.complete,
        desireId: outcome.desireId,
      },
    });

    console.log('updatedOutcome', updatedOutcome)

    const updateProgress = await outcome.desireOutcomeProgress.map(
      async (progress) => {

        const existingProgress = await prisma.desireOutcomeProgress.findUnique({
          where: { id: progress.id },
        });

        console.log("existingProgress", existingProgress);

        if (existingProgress) {
          return prisma.desireOutcomeProgress.upsert({
            where: { id: progress.id },
            update: {
              title: progress.title,
              description: progress.description,
              sortOrder: progress.sortOrder,
              dueDate: progress.dueDate,
              complete: progress.complete,
              desireOutcomeId:  outcome.id,
            },
            create: {
              title: progress.title,
              description: progress.description,
              sortOrder: progress.sortOrder,
              dueDate: progress.dueDate,
              complete: progress.complete,
              desireOutcomeId:  outcome.id,
            },
          });
        } else {
          return prisma.desireOutcomeProgress.create({
            data: {
              title: progress.title,
              description: progress.description,
              sortOrder: progress.sortOrder,
              dueDate: progress.dueDate,
              complete: progress.complete,
              desireOutcomeId:  outcome.id,
            },
          });
        }
      }
    );

    await Promise.all(updateProgress);
    return { updatedOutcome, updateProgress };
  } catch (error) {
    throw error;
  }
}

export async function getOutcomesByDesireId(desireId: Desire["id"]) {
  try {
    const outcomes = await prisma.desireOutcome.findMany({
      where: { desireId },
      orderBy: { sortOrder: "asc" },
      include: { desireOutcomeProgress: true },
    });
    return outcomes;
  } catch (error) {
    throw error;
  }
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
