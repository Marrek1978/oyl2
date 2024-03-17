import React from 'react'
import { useFetcher } from '@remix-run/react';

import type { CreationTodo } from '~/types/listTypes';

import DndInfo from '../DndInfo';
import SortableToDo from './SortableTodo';
import DndAndSortableContexts from '../DndAndSortableContexts';
import SubHeading14px from "~/components/headers/SubHeading14px";
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/displays/modals/useServerMessages';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';

interface DndTodosProps {
  todos: CreationTodo[];
  setTodoSortOrder: (todos: CreationTodo[]) => CreationTodo[];
  setTodos: React.Dispatch<React.SetStateAction<CreationTodo[]>>;
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTodoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTodo: React.Dispatch<React.SetStateAction<CreationTodo | null>>;
}


function DndTodos({ setTodos, todos, setTodoSortOrder, setIsEditToDoModalOpen, setSelectedTodoIndex, setSelectedTodo }: DndTodosProps) {

  const fetcher = useFetcher();

  const { handleDragEnd } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: todos, setSortableArray: setTodos, saveOrderToDB: false })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })


  const removeTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const handleOpeningEditModal = (todoId: string) => {
    const todo = todos.find(todo => todo.id === todoId) || null;
    const index = todos.findIndex(todo => todo.id === todoId);
    setSelectedTodoIndex(index);
    setSelectedTodo(todo)
    setIsEditToDoModalOpen(true);
  };

  return (
    <>
      <div className='flex justify-between items-center w-full'>
        <div className='text-success flex-1 w-full '>
          <SubHeading14px text='To Dos' />
        </div>
        <div className='flex-1'>
          <DndInfo />
        </div>
      </div>

      <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={todos}
        isVertical={true}
      >

        {todos?.map((todo) => (
          <SortableToDo
            key={todo.id}
            id={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            handleOpenEditModal={handleOpeningEditModal} />
        ))}
      </DndAndSortableContexts>
    </>
  )
}

export default DndTodos