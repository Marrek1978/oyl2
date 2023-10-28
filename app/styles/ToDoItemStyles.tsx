import type { Todo } from '~/types/listTypes';

interface ToDoItemStylesProps {
  todo: Todo;
}

export function ToDoItemStyles({ todo }: ToDoItemStylesProps) {
  return (
    todo['isUrgent'] ? 'text-accent-focus bg-accent-content'
      : todo['isImportant'] ? ' text-success-content bg-success'
        : 'text-base-content'
  )
}

export function ToDoItemStylesNoBg({ todo }: ToDoItemStylesProps) {
  return (
    todo['isUrgent'] ? 'text-accent'
      : todo['isImportant'] ? ' text-success'
        : 'text-base-content'
  )
}


