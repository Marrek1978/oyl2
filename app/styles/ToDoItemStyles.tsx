import type { Todo } from '~/types/listTypes';

interface ToDoItemStylesProps {
  todo: Todo;
}

export function ToDoItemStyles({todo}: ToDoItemStylesProps) {

  console.log( 'todo is ', todo)
  
  return (
    todo['urgent'] ? 'text-accent-focus bg-accent-content'
    : todo['important'] ? ' text-success-content bg-success'
      : 'text-base-content'
  )
}

export function ToDoItemStylesNoBg({todo}: ToDoItemStylesProps) {
  
  return (
    todo['urgent'] ? 'text-accent'
    : todo['important'] ? ' text-success'
      : 'text-base-content'
  )
}


