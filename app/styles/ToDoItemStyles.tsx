import type { Todo } from '~/types/listTypes';

interface ToDoItemStylesProps {
  todo: Todo;
}

export function ToDoItemStyles({todo}: ToDoItemStylesProps) {
  
  return (
    todo['urgent'] ? 'text-accent bg-danger-50'
    : todo['important'] ? ' text-info bg-info-100'
      : 'text-base-content'
  )
}

export function ToDoItemStylesNoBg({todo}: ToDoItemStylesProps) {
  
  return (
    todo['urgent'] ? 'text-accent'
    : todo['important'] ? ' text-info'
      : 'text-base-content'
  )
}


