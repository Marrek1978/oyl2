import { prisma } from "~/db.server";
import type { Task, Routine, User } from "@prisma/client";
import type { CreationTask } from "~/types/routineTypes";

export function getRoutines(userId: User["id"]) {
  try {
    const result = prisma.routine.findMany({
      where: { userId, outcomeId: undefined },
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

export function createRoutineAndTasks({
  userId,
  title,
  tasks,
  outcomeId,
  sortOrder
}: Pick<Routine, "title" | "sortOrder"> & { userId: User["id"] } & {
  tasks: CreationTask[];
} & {  outcomeId?: Routine["outcomeId"];
}) {
  console.log("🚀 ~ file: routines.server.ts:49 ~ sortOrder:", sortOrder)
  console.log("🚀 ~ file: routines.server.ts:49 ~ outcomeId:", outcomeId)
  console.log("🚀 ~ file: routines.server.ts:49 ~ tasks:", tasks)
  console.log("🚀 ~ file: routines.server.ts:49 ~ title:", title)
  console.log("🚀 ~ file: routines.server.ts:49 ~ userId:", userId)

  console.log('at server fucntion createRoutineAndTasks')

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
    console.log("🚀 ~ file: routines.server.ts:66 ~ result:", result)
    return result;
  } catch (error) {
    throw error;
  }
}

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

export async function deleteRoutine({ id }: Pick<Routine, "id">) {
  try {
    return prisma.routine.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

export async function reorderCompletedTasks({
  tasks,
}: {
  tasks: Task[];
}) {
  if (!tasks || !Array.isArray(tasks)) {
    throw new Error("Invalid routineToDos");
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

export async function updateRoutineAndTasks({
  id,
  title,
  userId,
  routineToDos,
}: Pick<Routine, "id" | "title"> & { userId: User["id"] } & {
  routineToDos: Task[];
}) {
  try {
    const updateRoutine = await prisma.routine.update({
      where: { id },
      data: { title },
    });

    const updateRoutineToDos = routineToDos.map((task) => {
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

    await Promise.all(updateRoutineToDos);
    return { updateRoutine, updateRoutineToDos };
  } catch (error) {
    throw error;
  }
}

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


export async function updateRoutinesOrder(routines: Routine[]) {
  try {
    const updatePromises = routines.map((routine) => {
    return prisma.routine.update({
      where: { id: routine.id },
      data: {
        sortOrder: routine.sortOrder,
      },
    });
  })

  const updateRoutines = await prisma.$transaction(updatePromises);
  return updateRoutines;
} catch (error) {
  throw error;
}
}


//?  ------------------ Outcome Lists ----------------- //

export async function getRoutinesByOutcomeId(userId: User["id"], outcomeId: Routine["outcomeId"]){
  try{
    return prisma.routine.findMany({
      where: { userId, outcomeId},
      include: {
        tasks: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
  }catch(error){
    throw error;
  }
}