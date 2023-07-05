import { prisma } from "~/db.server";
import type { RoutineToDos, Routines, User } from "@prisma/client";
import type { CreationRoutineToDo } from "~/types/routineTypes";

export function getRoutines({ userId }: { userId: User["id"] }) {
  const result = prisma.routines.findMany({
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
}: Pick<Routines, "title"> & { userId: User["id"] } & {
  routineToDos: CreationRoutineToDo[];
}) {
  const result = prisma.routines.create({
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
  id: RoutineToDos["id"];
  complete: RoutineToDos["complete"];
}) {
  try {
    const result = prisma.routineToDos.update({
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

export async function deleteRoutine({ id }: Pick<Routines, "id">) {
  return prisma.routines.delete({
    where: { id },
  });
}

export async function reorderCompletedRoutineToDos({
  routineToDos,
}: {
  routineToDos: RoutineToDos[];
}) {
  if (!routineToDos || !Array.isArray(routineToDos)) {
    throw new Error("Invalid routineToDos");
  }

  const updateOrder = routineToDos.map((routineToDo) => {
    return prisma.routineToDos.update({
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
}: Pick<Routines, "id" | "title"> & { userId: User["id"] } & {
  routineToDos: RoutineToDos[];
}) {

    const updateRoutine = await prisma.routines.update({
      where: { id },
      data: { title },
    })

    const updateRoutineToDos = routineToDos.map((routineToDo) => {
      return prisma.routineToDos.upsert({
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
