import { prisma } from "~/db.server";
import type { List, User, ListToDo } from "@prisma/client";

import type { ListAndToDos, Todo } from "~/types/listTypes";

type CreateTodo = {
  body: ListToDo["body"];
  urgent: ListToDo["urgent"];
  important: ListToDo["important"];
  complete: ListToDo["complete"];
  dueDate: ListToDo["dueDate"];
  sortOrder: ListToDo["sortOrder"];
};

// Get a list by id and userId
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
export function getListItems({ userId }: { userId: User["id"] }) {
  try {
    return prisma.list.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    throw error;
  }
}

export function getListAndTodos({ userId }: { userId: User["id"] }) {
  try {
    return prisma.list.findMany({
      // where: { userId },
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

//update the todo table based on it's id, the list id, adn teh user id
export async function updateToDoComplete({
  id,
  complete,
}: {
  id: ListToDo["id"];
  complete: ListToDo["complete"];
}) {
  try {
    const result = prisma.listToDo.update({
      where: {
        id: id,
      },
      data: {
        complete: complete,
      },
    });

    console.log("Updated records:", result);
    return result;
  } catch (error) {
    console.error("Error updating ToDo:", error);
    throw error;
  }
}
// Delete a list by id
export async function deleteList({ id }: Pick<List, "id">) {
  try {
    return prisma.list.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
}

export async function createListAndTodos({
  title,
  userId,
  todos,
}: Pick<List, "title"> & { userId: User["id"] } & {
  todos: CreateTodo[];
}) {
  try {
    return await prisma.list.create({
      data: {
        title,
        userId,
        todos: {
          createMany: {
            data: todos,
          },
        },
      },
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
  todos: Todo[];
}) {
  try {
    const updateList = await prisma.list.update({
      where: { id },
      data: {
        title,
      },
    });

    const updateTodos = await todos.map((todo) => {
      return prisma.listToDo.upsert({
        where: { id: todo.id },
        create: {
          body: todo.body,
          urgent: todo.urgent,
          important: todo.important,
          complete: todo.complete,
          dueDate: todo.dueDate,
          sortOrder: todo.sortOrder !== null ? todo.sortOrder : 0,
          list: { connect: { id } },
        },
        update: {
          body: todo.body,
          urgent: todo.urgent,
          important: todo.important,
          complete: todo.complete,
          dueDate: todo.dueDate,
          sortOrder: todo.sortOrder !== null ? todo.sortOrder : 0,
        },
      });
    });
    await Promise.all(updateTodos);
    return { updateList, updateTodos };
  } catch (error) {
    throw error;
  }
}

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
        complete: true,
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
    | "urgent"
    | "important"
    | "complete"
    | "dueDate"
    | "sortOrder"
  >
>;
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
    const flattenedTodos = user.lists.flatMap((list:ListAndToDos) => list.todos);
    return flattenedTodos;
  } catch (error) {
    throw error;
  }
}

export async function getToDosWhereDueDate({ userId }: { userId: User["id"] }) {
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
                complete: false,
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
    const flattenedTodos = user.lists.flatMap((list:ListAndToDos) => list.todos);
    return flattenedTodos;
  } catch (error) {
    throw error;
  }
}

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
