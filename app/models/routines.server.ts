import { prisma } from "~/db.server";
import type { RoutineToDo, Routine, User } from "@prisma/client";
import type { CreationRoutineToDo } from "~/types/routineTypes";

export function getRoutines(  userId: User["id"] ) {
  try {
    const result = prisma.routine.findMany({
      where: { userId, projectId: null, outcomeId: null },
      include: {
        routineToDos: {
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

export function createRoutineAndToDos({
  userId,
  title,
  routineToDos,
  projectId,
  outcomeId,
}: Pick<Routine, "title"> & { userId: User["id"] } & {
  routineToDos: CreationRoutineToDo[];
} & { projectId?: Routine["projectId"] } & {
  outcomeId?: Routine["outcomeId"];
}) {
  try {
    const result = prisma.routine.create({
      data: {
        title,
        userId,
        projectId,
        outcomeId,
        routineToDos: {
          createMany: {
            data: routineToDos,
          },
        },
      },
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export async function updateRoutineToDoComplete({
  id,
  complete,
}: {
  id: RoutineToDo["id"];
  complete: RoutineToDo["complete"];
}) {
  try {
    const result = prisma.routineToDo.update({
      where: {
        id: id,
      },
      data: {
        complete: complete,
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

export async function reorderCompletedRoutineToDos({
  routineToDos,
}: {
  routineToDos: RoutineToDo[];
}) {
  if (!routineToDos || !Array.isArray(routineToDos)) {
    throw new Error("Invalid routineToDos");
  }

  try {
    const updateOrder = routineToDos.map((routineToDo) => {
      return prisma.routineToDo.update({
        where: { id: routineToDo.id },
        data: { sortOrder: routineToDo.sortOrder },
      });
    });

    await Promise.all(updateOrder);
    return { updateOrder };
  } catch (error) {
    throw error;
  }
}

export async function updateRoutineAndTodos({
  id,
  title,
  userId,
  routineToDos,
}: Pick<Routine, "id" | "title"> & { userId: User["id"] } & {
  routineToDos: RoutineToDo[];
}) {
  try {
    const updateRoutine = await prisma.routine.update({
      where: { id },
      data: { title },
    });

    const updateRoutineToDos = routineToDos.map((routineToDo) => {
      return prisma.routineToDo.upsert({
        where: { id: routineToDo.id },
        create: {
          body: routineToDo.body,
          complete: routineToDo.complete,
          sortOrder: routineToDo.sortOrder,
          routine: { connect: { id } },
        },
        update: {
          body: routineToDo.body,
          complete: routineToDo.complete,
          sortOrder: routineToDo.sortOrder,
        },
      });
    });

    await Promise.all(updateRoutineToDos);
    return { updateRoutine, updateRoutineToDos };
  } catch (error) {
    throw error;
  }
}

export async function getProjectDesiredOutcomeRoutinesWithToDos(
  userId: User["id"],
  projectId: Routine["projectId"],
  outcomeId: Routine["outcomeId"]
) {
  try {
    const result = await prisma.routine.findMany({
      where: { userId, projectId, outcomeId },
      include: {
        routineToDos: {
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
