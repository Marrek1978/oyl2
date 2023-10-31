import { prisma } from "~/db.server";
import type { List, User, ToDo } from "@prisma/client";
import type { GenerticTodo } from "~/types/listTypes";

type CreateTodo = {
  body: ToDo["body"];
  urgent: ToDo["isUrgent"];
  important: ToDo["isImportant"];
  complete: ToDo["isComplete"];
  dueDate: ToDo["dueDate"];
  sortOrder: ToDo["sortOrder"];
};

// - ******************* LIST CRUD *******************//
//createList
//getAllListsAndTodos
//updateListAndTodos
//deleteList
//updateListsOrder
//- ? ******************* GET LISTS BY CRITERIA *******************//
//getMiscListsAndTodos
//getToDosWhere
//getToDosWhereDueDate
//getListsByOutcomeId
//getSpecialListsWithTodos

//! ******************* TO DO CRUD *******************//
//_ ? ******************* COMPLETED TODO FUNCTIONS *******************//
// updateCompletedTodos
// reorderCompletedToDos
// DeleteCompletedToDosFromList  !!!!!!!!!!
// deleteCompletedToDosFromPriorityList

//* ******************* LIST CRUD *******************//
//createList
//getAllListsAndTodos
//updateListAndTodos
//updateListsOrder
//deleteList

export async function createList({
  title,
  userId,
  todos,
  outcomeId,
  sortOrder,
}: Pick<List, "title"> & { userId: User["id"] } & { todos: CreateTodo[] } & {
  outcomeId?: List["outcomeId"];
} & { sortOrder?: List["sortOrder"] }) {
  const data: any = {
    title,
    userId,
    sortOrder,
    todos: {
      createMany: {
        data: todos,
      },
    },
  };

  if (outcomeId) {
    data.outcomeId = outcomeId;
  }

  try {
    return await prisma.list.create({
      data,
    });
  } catch (error) {
    throw error;
  }
}

export function getAllListsAndTodos(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId },
      include: {
        todos: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "desc" },
    });
  } catch (error) {
    throw error;
  }
}

export async function updateListAndTodos({
  id,
  title,
  userId,
  todos,
}: Pick<List, "id" | "title"> & { userId: User["id"] } & {
  todos: GenerticTodo[];
}) {
  try {
    //delete
    const existingTodos = await prisma.toDo.findMany({
      where: { listId: id },
    });

    const existingTodoIds = existingTodos.map((todo) => todo.id);
    const providedTodoIds = todos.map((todo) => todo.id);
    const todoIdsToDelete = existingTodoIds.filter(
      (id) => !providedTodoIds.includes(id)
    );
    const deletePromises = todoIdsToDelete.map((id) =>
      prisma.toDo.delete({ where: { id } })
    );
    await prisma.$transaction(deletePromises);

    //update title
    const updatedList = await prisma.list.update({
      where: { id, userId },
      data: {
        title,
      },
    });

    //update Todos
    const updatePromises = await todos.map((todo) => {
      return prisma.toDo.upsert({
        where: { id: todo.id },
        create: {
          body: todo.body,
          isUrgent: todo.isUrgent,
          isImportant: todo.isImportant,
          isComplete: todo.isComplete,
          dueDate: todo.dueDate,
          sortOrder: todo.sortOrder !== null ? todo.sortOrder : 0,
          list: { connect: { id } },
        },
        update: {
          body: todo.body,
          isUrgent: todo.isUrgent,
          isImportant: todo.isImportant,
          isComplete: todo.isComplete,
          dueDate: todo.dueDate,
          sortOrder: todo.sortOrder !== null ? todo.sortOrder : 0,
        },
      });
    });

    const updatedToDos = await prisma.$transaction(updatePromises);
    return { updatedList, updatedToDos };
  } catch (error) {
    throw error;
  }
}

export async function updateListsOrder(lists: List[]) {
  try {
    const updatePromises = lists.map((list) => {
      return prisma.list.update({
        where: { id: list.id },
        data: {
          sortOrder: list.sortOrder,
        },
      });
    });

    const updateLists = await prisma.$transaction(updatePromises);
    return updateLists;
  } catch (error) {
    throw error;
  }
}

export async function deleteList({ id }: Pick<List, "id">) {
  try {
    return prisma.list.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

//? ******************* GET LISTS BY CRITERIA *******************//
//getListsByOutcomeId
//getMiscListsAndTodos
//getSpecialListsWithTodos
//getToDosWhere
//getToDosWhereDueDate

export async function getListsByOutcomeId(
  userId: User["id"],
  outcomeId: List["outcomeId"]
) {
  try {
    return prisma.list.findMany({
      where: { userId, outcomeId },
      include: {
        todos: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    throw error;
  }
}

export function getMiscListsAndTodos(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId, outcomeId: null, isSpecialList: false },
      include: {
        todos: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    throw error;
  }
}

export async function getSpecialListsWithTodos(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId, isSpecialList: true },
      include: {
        todos: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    throw error;
  }
}

export async function getToDosWhere(
  { userId }: { userId: User["id"] },
  condition: ToDoCondition
): Promise<ToDo[]> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lists: {
          select: {
            todos: {
              where: condition,
            },
          },
        },
      },
    });

    // Handle the error or return an empty array
    if (!user || !user.lists) return [];

    // Flatten the todos into a single array
    const flattenedTodos = user.lists.flatMap((list) => list.todos);
    return flattenedTodos;
  } catch (error) {
    throw error;
  }
}

export async function getToDosWhereDueDate(userId: User["id"]) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lists: {
          select: {
            todos: {
              where: {
                dueDate: {
                  not: null,
                },
                isComplete: false,
              },
            },
          },
        },
      },
    });

    // Handle the error or return an empty array
    if (!user || !user.lists) return [];

    // Flatten the todos into a single array
    const flattenedTodos = user.lists.flatMap((list) => list.todos);
    return flattenedTodos;
  } catch (error) {
    throw error;
  }
}

//! ******************* TO DO CRUD *******************//
//? ******************* COMPLETED TODO FUNCTIONS *******************//
// updateCompletedTodos
// reorderCompletedToDos
// DeleteCompletedToDosFromList
// deleteCompletedToDosFromPriorityList

export async function updateCompletedTodos({
  id,
  isComplete,
}: {
  id: ToDo["id"];
  isComplete: ToDo["isComplete"];
}) {
  try {
    const result = prisma.toDo.update({
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

export async function reorderCompletedToDos({ todos }: { todos: ToDo[] }) {
  try {
    const updateTodos = todos.map((todo) => {
      return prisma.toDo.update({
        where: { id: todo.id },
        data: {
          sortOrder: todo.sortOrder,
        },
      });
    });

    await Promise.all(updateTodos);
    return { updateTodos };
  } catch (error) {
    throw error;
  }
}

export async function deleteCompletedToDosFromList({ id }: Pick<List, "id">) {
  try {
    return await prisma.toDo.deleteMany({
      where: {
        listId: id,
        isComplete: true,
      },
    });
  } catch (error) {
    throw error;
  }
}

type ToDoCondition = Partial<
  Pick<
    ToDo,
    | "id"
    | "body"
    | "isUrgent"
    | "isImportant"
    | "isComplete"
    | "dueDate"
    | "sortOrder"
  >
>;

export async function deleteCompletedToDosFromPriorityList(
  completedTodoIds: string[]
) {
  try {
    const deleteCompletedToDos = completedTodoIds.map((id) => {
      return prisma.toDo.delete({
        where: { id: id },
      });
    });
    await Promise.all(deleteCompletedToDos);
    return { deleteCompletedToDos };
  } catch (error) {
    throw error;
  }
}
