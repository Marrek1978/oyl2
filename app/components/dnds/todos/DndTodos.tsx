import React from 'react'
import { SortableItem } from '~/components/dnds/todos/SortableItem'
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import type { CreationTodo } from '~/types/listTypes';

interface DndTodosProps {
  setTodos: React.Dispatch<React.SetStateAction<CreationTodo[]>>;
  todos: CreationTodo[];
  setTodoSortOrder: (todos: CreationTodo[]) => CreationTodo[];
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTodoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTodo: React.Dispatch<React.SetStateAction<CreationTodo | null>>;
}

function DndTodos({setTodos, todos, setTodoSortOrder, setIsEditToDoModalOpen, setSelectedTodoIndex, setSelectedTodo}: DndTodosProps) {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTodos((prevTodos: CreationTodo[]) => {
        const oldIndex = prevTodos.findIndex(todo => todo.id === active.id);
        const newIndex = prevTodos.findIndex(todo => todo.id === over?.id);
        const newTodos = arrayMove(prevTodos, oldIndex, newIndex);
        return setTodoSortOrder(newTodos)
      });
    }
  }

  const removeTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const handleOpeningEditModal = (todoId: string) => {
    const todo = todos.find(todo => todo.id === todoId) || null;
    const index = todos.findIndex(todo => todo.id === todoId);
    setSelectedTodoIndex(index);
    setSelectedTodo(todo)
    console.log('handleOpenModal')
    setIsEditToDoModalOpen(true);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={todos?.map(todo => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos?.map((todo) => (
            <SortableItem
              key={todo.id}
              id={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              handleOpenEditModal={handleOpeningEditModal} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  )
}

export default DndTodos