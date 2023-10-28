import React from 'react'

import type { CreationRoutineToDo } from '~/types/routineTypes';
import { useFetcher } from '@remix-run/react';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '../DndAndSortableContexts';
// import SortableToDo from '../todos/SortableTodo';

interface DndRoutineToDosProps {
  setTodos: React.Dispatch<React.SetStateAction<CreationRoutineToDo[]>>;
  todos: CreationRoutineToDo[];
  setTodoSortOrder: (todos: CreationRoutineToDo[]) => CreationRoutineToDo[];
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTodoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTodo: React.Dispatch<React.SetStateAction<CreationRoutineToDo | null>>;

}


function DndTasks({setTodos, todos, setTodoSortOrder, setIsEditToDoModalOpen, setSelectedTodoIndex, setSelectedTodo}: DndRoutineToDosProps) {
 
 
  const fetcher = useFetcher();

  const { handleDragEnd } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: todos, setSortableArray: setTodos, saveOrderToDB: false })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })



  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;
  //   if (active.id !== over?.id) {
  //     setTodos((prevTodos: CreationRoutineToDo[]) => {
  //       const oldIndex = prevTodos.findIndex(todo => todo.id === active.id);
  //       const newIndex = prevTodos.findIndex(todo => todo.id === over?.id);
  //       const newTodos =  arrayMove(prevTodos, oldIndex, newIndex);
  //       return resetRoutineTodosSortOrder(newTodos)
  //     });
  //   }
  // }
  
  // const removeRoutineTodo = (todoId: string) => {
  //   setTodos(todos.filter(todo => todo.id !== todoId));
  // };

  // const handleOpeningEditModal = (todoId: string) => {
  //   const todo = todos.find(todo => todo.id === todoId) || null;
  //   const index = todos.findIndex(todo => todo.id === todoId);
  //   setSelectedTodoIndex(index);
  //   setSelectedTodo(todo)
  //   setIsEditToDoModalOpen(true);
  // };
 
  return (
    <>
       <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={todos}
        isVertical={true}
      >
          {/* {todos?.map((todo) => (
            <SortableToDo
              key={todo.id}
              id={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              handleOpenEditModal={handleOpeningEditModal} />
          ))} */}
       </DndAndSortableContexts>
    </>
  )
}

export default DndTasks