import { prisma } from "~/db.server";
import type { Task, Routine, User } from "@prisma/client";
import type { CreationTask } from "~/types/routineTypes";

//-?  ------------------ CRUD ----------------- //
//createRoutineAndTasks
//getAllRoutines
//updateRoutineAndTasks
//updateRoutinesOrder
//deleteRoutine
//-?  ------------------ GET BY CRITERIA ----------------- //
//getOutcomeRoutinesWithTasks
//getRoutinesByOutcomeId
//getMiscRoutinesWithTasks
//getSpecialRoutinesWithTasks

//-! ******************* TASK CRUD *******************//
//-?  ------------------ COMPLETED TASKS ----------------- //
//updateCompletedTasks
//reorderCompletedTasks

//?  ------------------ CRUD ----------------- //
//createRoutineAndTasks
//getAllRoutines
//updateRoutineAndTasks
//updateRoutinesOrder
//deleteRoutine
export function createRoutineAndTasks({
  userId,
  title,
  tasks,
  outcomeId,
  sortOrder,
}: Pick<Routine, "title" | "sortOrder"> & { userId: User["id"] } & {
  tasks: CreationTask[];
} & { outcomeId?: Routine["outcomeId"] }) {
  try {
    const result = prisma.routine.create({
      data: {
        title,
        sortOrder,
        userId,
        outcomeId,
        tasks: {
          createMany: {
            data: tasks,
          },
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export function getAllRoutines(userId: User["id"]) {
  try {
    const result = prisma.routine.findMany({
      where: { userId },
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function updateRoutineAndTasks({
  id,
  title,
  userId,
  tasks,
}: Pick<Routine, "id" | "title"> & { userId: User["id"] } & {
  tasks: Task[];
}) {
  try {
    //delete
    const existingTasks = await prisma.task.findMany({
      where: { routineId: id },
    });
    const existingTaskIds = existingTasks.map((task) => task.id);
    const providedTaskIds = tasks.map((task) => task.id);
    const tasksToDelete = existingTaskIds.filter(
      (id) => !providedTaskIds.includes(id)
    );
    const deletePromises = tasksToDelete.map((id) =>
      prisma.task.delete({ where: { id } })
    );
    await prisma.$transaction(deletePromises);

    //update ttile
    const updateRoutine = await prisma.routine.update({
      where: { id, userId },
      data: { title },
    });

    //update tasks
    const updatePromises = tasks.map((task: Task) => {
      return prisma.task.upsert({
        where: { id: task.id },
        create: {
          body: task.body,
          isComplete: task.isComplete,
          sortOrder: task.sortOrder,
          routine: { connect: { id } },
        },
        update: {
          body: task.body,
          isComplete: task.isComplete,
          sortOrder: task.sortOrder,
        },
      });
    });

    const updatedTasks = await prisma.$transaction(updatePromises);
    return { updateRoutine, updatedTasks };
  } catch (error) {
    throw error;
  }
}

export async function updateRoutinesOrder(routines: Routine[]) {
  try {
    const updatePromises = routines.map((routine) => {
      return prisma.routine.update({
        where: { id: routine.id },
        data: {
          sortOrder: routine.sortOrder,
        },
      });
    });

    const updateRoutines = await prisma.$transaction(updatePromises);
    return updateRoutines;
  } catch (error) {
    throw error;
  }
}

export async function deleteRoutine({ id }: Pick<Routine, "id">) {
  try {
    return prisma.routine.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

//?  ------------------ GET BY CRITERIA ----------------- //
//getOutcomeRoutinesWithTasks
//getRoutinesByOutcomeId
//getMiscRoutinesWithTasks

export async function getOutcomeRoutinesWithTasks(
  userId: User["id"],
  outcomeId: Routine["outcomeId"]
) {
  try {
    const result = await prisma.routine.findMany({
      where: { userId, outcomeId },
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getRoutinesByOutcomeId(
  userId: User["id"],
  outcomeId: Routine["outcomeId"]
) {
  try {
    return prisma.routine.findMany({
      where: { userId, outcomeId },
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    throw error;
  }
}

export async function getMiscRoutinesWithTasks(userId: User["id"]) {
  try {
    return prisma.routine.findMany({
      where: { userId, outcomeId: null, isSpecialRoutine: false },
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    throw error;
  }
}

export async function getSpecialRoutinesWithTasks(userId: User["id"]) {
try{
  return prisma.routine.findMany({
    where: { userId, isSpecialRoutine: true },
    include: {
      tasks: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
} catch (error) {throw error}

}




//! ******************* TASK CRUD *******************//
//?  ------------------ COMPLETED TASKS ----------------- //
//updateCompletedTasks
//reorderCompletedTasks

export async function updateCompletedTasks({
  id,
  isComplete,
}: {
  id: Task["id"];
  isComplete: Task["isComplete"];
}) {
  try {
    const result = prisma.task.update({
      where: {
        id: id,
      },
      data: {
        isComplete,
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function reorderCompletedTasks({ tasks }: { tasks: Task[] }) {
  if (!tasks || !Array.isArray(tasks)) {
    throw new Error("Invalid Tasks");
  }

  try {
    const updateOrder = tasks.map((task) => {
      return prisma.task.update({
        where: { id: task.id },
        data: { sortOrder: task.sortOrder },
      });
    });

    await Promise.all(updateOrder);
    return { updateOrder };
  } catch (error) {
    throw error;
  }
}
