// types.ts
import type { ToDo, List } from "@prisma/client";
import type { RoutineAndTasks, RoutineAndTasksWithStrDates, RoutineToDo } from "~/types/routineTypes";

export type ListAndToDos = List & {
  todos: ToDo[];
};

export interface CreationTodo
  extends Omit<ToDo, "listId" | "createdAt" | "updatedAt"> {}

// export interface DatabaseTodo extends CreationTodo {
//   createdAt: Date;
//   updatedAt: Date;
//   listId: string;
// }

export type GenerticTodo = CreationTodo | ToDo;

export type ImportedLists = ListAndToDos[] | RoutineAndTasks[];
export type ImportedList = ListAndToDos | RoutineAndTasks;
export type allTodoTypes = GenerticTodo | RoutineToDo;

export type ListWithStrDates = Omit<List, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type ToDoWithStrDates = Omit<
  ToDo,
  "createdAt" | "updatedAt" | "dueDate"
> & {
  createdAt: string;
  updatedAt: string;
  dueDate: string;
};

export type ListAndTodosWithStrDates = ListWithStrDates & {
  todos: ToDoWithStrDates[];
};

export type ListArrayTypes =  ListAndToDos[] | ListAndTodosWithStrDates[] |  RoutineAndTasks[] | RoutineAndTasksWithStrDates[]

export type ListTypes =  ListAndToDos | ListAndTodosWithStrDates |  RoutineAndTasks | RoutineAndTasksWithStrDates
