import { prisma } from "~/db.server";
import type { List, User, ListToDo } from "@prisma/client";

import type { Todo } from "~/types/listTypes";

type CreateTodo = {
  body: ListToDo["body"];
  urgent: ListToDo["isUrgent"];
  important: ListToDo["isImportant"];
  complete: ListToDo["isComplete"];
  dueDate: ListToDo["dueDate"];
  sortOrder: ListToDo["sortOrder"];
};

//************* CREATE LIST WITH OR WITHOUT OUTCOME ID ***************//
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

//************* GET ALL LIST AND TODOS BY USER ID ***************//
export function getAllListAndTodos(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId },
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

//************* GET MISC. LIST AND TODOS BY USER ID ***************//

export function getListAndTodos(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId, outcomeId: undefined },
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

//************* UPDATE LIST  OUTCOME ID NOT NEEDED ***************//
export async function updateListAndTodos({
  id,
  title,
  userId,
  todos,
}: Pick<List, "id" | "title"> & { userId: User["id"] } & { todos: Todo[] }) {
  try {
    const updatedList = await prisma.list.update({
      where: { id, userId },
      data: {
        title,
      },
    });

    const updatePromises = await todos.map((todo) => {
      return prisma.listToDo.upsert({
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

//************* UPDATE COMPLETED TODO BY ID ***************//
export async function updateToDoComplete({
  id,
  isComplete,
}: {
  id: ListToDo["id"];
  isComplete: ListToDo["isComplete"];
}) {
  try {
    const result = prisma.listToDo.update({
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

//? ***********************DELETE *************************//
export async function deleteList({ id }: Pick<List, "id">) {
  try {
    return prisma.list.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

//??? ******************  TO DO CRUD ******************//
export async function reorderCompletedToDos({ todos }: { todos: ListToDo[] }) {
  try {
    const updateTodos = todos.map((todo) => {
      return prisma.listToDo.update({
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
    return await prisma.listToDo.deleteMany({
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
    ListToDo,
    | "id"
    | "body"
    | "isUrgent"
    | "isImportant"
    | "isComplete"
    | "dueDate"
    | "sortOrder"
  >
>;

//? ************* GET TO DO BY CRITERIA   ***************//
export async function getToDosWhere(
  { userId }: { userId: User["id"] },
  condition: ToDoCondition
): Promise<ListToDo[]> {
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
    if (!user || !user.lists) {
      return [];
    }

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
    if (!user || !user.lists) {
      return [];
    }

    // Flatten the todos into a single array
    const flattenedTodos = user.lists.flatMap((list) => list.todos);
    return flattenedTodos;
  } catch (error) {
    throw error;
  }
}

//  ??  *******************  SPECIAL FOR TODAY/PRIORITIES PAGES*******************//
export async function deleteCompletedToDosFromPriorityList(
  completedTodoIds: string[]
) {
  try {
    const deleteCompletedToDos = completedTodoIds.map((id) => {
      return prisma.listToDo.delete({
        where: { id: id },
      });
    });
    await Promise.all(deleteCompletedToDos);
    return { deleteCompletedToDos };
  } catch (error) {
    throw error;
  }
}

//?  ------------------ Outcome Lists ----------------- //

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

//! *****************   NOT USED? *****************//
export function getList({
  id,
  userId,
}: Pick<List, "id"> & { userId: User["id"] }) {
  try {
    return prisma.list.findFirst({
      where: { id, userId },
    });
  } catch (error) {
    throw error;
  }
}

// Get all list for a specific user
export function getListItems(userId: User["id"]) {
  try {
    return prisma.list.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    throw error;
  }
}
