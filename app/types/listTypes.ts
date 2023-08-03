// types.ts
import type { List as PrismaList, ListToDo } from '@prisma/client'
import type { RoutineAndToDos, RoutineToDo } from './routineTypes';

export type ListAndToDos = PrismaList & {
  todos: ListToDo[],
}

export interface CreationTodo {
  id: string;
  body: string;
  urgent: boolean;
  important: boolean;
  complete: boolean;
  dueDate: Date | null;
  sortOrder: number | null;
  // createdAt: string;
}

export interface DatabaseTodo extends CreationTodo {
  createdAt: Date;
  updatedAt: Date;
  listId: string;
}

export type Todo = CreationTodo | DatabaseTodo;

export type ImportedLists = ListAndToDos[] | RoutineAndToDos[]
export type ImportedList = ListAndToDos | RoutineAndToDos
export type allTodoTypes = Todo | RoutineToDo 



