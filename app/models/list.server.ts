// list.server.ts

import { prisma } from "~/db.server";
import type { List, User, ToDo } from "@prisma/client";
import type { Todo } from "~/types/listTypes";

type CreateTodo = {
  body: ToDo["body"];
  urgent: ToDo["urgent"];
  important: ToDo["important"];
  complete: ToDo["complete"];
  dueDate: ToDo["dueDate"];
  sortOrder: ToDo["sortOrder"];
};

// Get a list by id and userId
export function getList({
  id,
  userId,
}: Pick<List, "id"> & { userId: User["id"] }) {
  return prisma.list.findFirst({
    where: { id, userId },
  });
}

// Get all list for a specific user
export function getListItems({ userId }: { userId: User["id"] }) {
  return prisma.list.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function getListAndTodos({ userId }: { userId: User["id"] }) {
  return prisma.list.findMany({
    where: { userId },
    include: {
      todos: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

//update the todo table based on it's id, the list id, adn teh user id
export async function updateToDoComplete({
  id,
  complete,
}: {
  id: ToDo["id"];
  complete: ToDo["complete"];
}) {
  try {
    const result = prisma.toDo.update({
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
// Delete a list by id and userId
export function deleteList({ id }: Pick<List, "id">) {
  return prisma.list.delete({
    where: { id },
  });
}

export async function createListAndTodos({
  title,
  userId,
  todos,
  is_recurring,
}: Pick<List, "title" | "is_recurring"> & { userId: User["id"] } & {
  todos: CreateTodo[];
}) {
  return await prisma.list.create({
    data: {
      title,
      userId,
      is_recurring,
      todos: {
        createMany: {
          data: todos,
        },
      },
    },
  });
}

export async function updateListAndTodos({
  id,
  title,
  userId,
  todos,
  is_recurring,
}: Pick<List, "id" | "title" | "is_recurring"> & { userId: User["id"] } & {
  todos: Todo[];
}) {
  const updateList = prisma.list.update({
    where: { id },
    data: {
      title,
      is_recurring,
    },
  });

  const updateTodos = todos.map((todo) => {
    return prisma.toDo.upsert({
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
}

export async function deleteCompletedToDosFromList({ id }: Pick<List, "id">) {
  return await prisma.toDo.deleteMany({
    where: {
      listId: id,
      complete: true,
    },
  });
}

type ToDoCondition = Partial<
  Pick<
    ToDo,
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
): Promise<ToDo[]> {
  const user  = await prisma.user.findUnique({
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
}

export async function getToDosWhereDueDate( { userId }: { userId: User["id"] }){
  const user  = await prisma.user.findUnique({
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
  const flattenedTodos = user.lists.flatMap((list) => list.todos);
  return flattenedTodos;
}

export async function deleteCompletedToDosFromPriorityList( completedTodoIds:string[] ) {
  const deleteCompletedToDos = completedTodoIds.map((id) => {
    return prisma.toDo.delete({
      where: { id: id },
    });
  });
  await Promise.all(deleteCompletedToDos);
  return { deleteCompletedToDos };
}


