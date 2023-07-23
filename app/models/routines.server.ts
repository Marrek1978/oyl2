import { prisma } from "~/db.server";
import type { RoutineToDo, Routine, User } from "@prisma/client";
import type { CreationRoutineToDo } from "~/types/routineTypes";

export function getRoutines({ userId }: { userId: User["id"] }) {
  const result = prisma.routine.findMany({
    where: { userId },
    include: {
      routineToDos: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return result;
}

export function createRoutineAndToDos({
  userId,
  title,
  routineToDos,
}: Pick<Routine, "title"> & { userId: User["id"] } & {
  routineToDos: CreationRoutineToDo[];
}) {
  const result = prisma.routine.create({
    data: {
      title,
      userId,
      routineToDos: {
        createMany: {
          data: routineToDos,
        },
      },
    },
  });
  return result;
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
  return prisma.routine.delete({
    where: { id },
  });
}

export async function reorderCompletedRoutineToDos({
  routineToDos,
}: {
  routineToDos: RoutineToDo[];
}) {
  if (!routineToDos || !Array.isArray(routineToDos)) {
    throw new Error("Invalid routineToDos");
  }

  const updateOrder = routineToDos.map((routineToDo) => {
    return prisma.routineToDo.update({
      where: { id: routineToDo.id },
      data: { sortOrder: routineToDo.sortOrder },
    });
  });

  await Promise.all(updateOrder);
  return { updateOrder };
}

export async function updateRoutineAndTodos({
  id,
  title,
  userId,
  routineToDos,
}: Pick<Routine, "id" | "title"> & { userId: User["id"] } & {
  routineToDos: RoutineToDo[];
}) {

    const updateRoutine = await prisma.routine.update({
      where: { id },
      data: { title },
    })

    const updateRoutineToDos = routineToDos.map((routineToDo) => {
      return prisma.routineToDo.upsert({
        where: { id: routineToDo.id },
        create:{
          body: routineToDo.body,
          complete: routineToDo.complete,
          sortOrder: routineToDo.sortOrder,
          routine:{connect:{id}},
        },
        update: {
          body: routineToDo.body,
          complete: routineToDo.complete,
          sortOrder: routineToDo.sortOrder,
        },

      });
    })

    await Promise.all(updateRoutineToDos);
    return { updateRoutine, updateRoutineToDos };

}
