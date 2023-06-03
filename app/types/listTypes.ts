// types.ts
import type { List as PrismaList, ToDo } from '@prisma/client'

export type ListAndToDos = PrismaList & {
  todos: ToDo[],
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


//devault todo from prisma
// id	text			yes	no	Edit Delete
// body	text				no	Edit Delete
// urgent	boolean				no	Edit Delete
// important	boolean				no	Edit Delete
// complete	boolean		false		no	Edit Delete
// dueDate	timestamp(3) without time zone				yes	Edit Delete
// sortOrder	integer				no	Edit Delete
// createdAt	timestamp(3) without time zone		CURRENT_TIMESTAMP		no	Edit Delete
// updatedAt	timestamp(3) without time zone				no	Edit Delete
// listId	text