import type { ToDo } from '@prisma/client';
import type { CreationTodo } from '~/types/listTypes';

interface ToDoItemStylesProps {
  todo: CreationTodo | ToDo  ;
}

export function ToDoItemStyles( {todo}: ToDoItemStylesProps) {
  return (
    todo['isUrgent']
      ? 'text-accent-focus bg-accent-content'
      : todo['isImportant'] ? ' text-success-content bg-success/50'
        : 'text-base-content'
  )
}

export function ToDoItemStylesNoBg({ todo }: ToDoItemStylesProps) {
  return (
    todo['isUrgent']
      ? 'text-accent-focus'
      : todo['isImportant'] ? ' text-success'
        : 'text-base-content'
  )
}


