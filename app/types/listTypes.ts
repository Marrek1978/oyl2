// types.ts
import type { Lists as PrismaList, ListToDos } from '@prisma/client'

export type ListAndToDos = PrismaList & {
  todos: ListToDos[],
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


