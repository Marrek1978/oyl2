// types.ts
import type { ListToDo, List } from "@prisma/client";
import type { RoutineAndToDos, RoutineToDo } from "./routineTypes";

export type ListAndToDos = List & {
  todos: ListToDo[];
};

export interface CreationTodo
  extends Omit<ListToDo, "listId" | "createdAt" | "updatedAt"> {}

export interface DatabaseTodo extends CreationTodo {
  createdAt: Date;
  updatedAt: Date;
  listId: string;
}

export type Todo = CreationTodo | DatabaseTodo;

export type ImportedLists = ListAndToDos[] | RoutineAndToDos[];
export type ImportedList = ListAndToDos | RoutineAndToDos;
export type allTodoTypes = Todo | RoutineToDo;

export type ListWithStrDates = Omit<List, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type TodoWithStrDates = Omit<
  ListToDo,
  "createdAt" | "updatedAt" | "dueDate"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string;
};

export type ListAndTodosWithStrDates = ListWithStrDates & {
  todos: TodoWithStrDates[];
};
