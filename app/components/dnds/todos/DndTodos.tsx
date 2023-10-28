import React from 'react'

import type { CreationTodo } from '~/types/listTypes';
import SubHeading14px from "~/components/titles/SubHeading14px";

import DndAndSortableContexts from '../DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '../useDndDropOrderSaveFunctions';
import { useFetcher } from '@remix-run/react';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndInfo from '../DndInfo';
import SortableToDo from './SortableTodo';

interface DndTodosProps {
  setTodos: React.Dispatch<React.SetStateAction<CreationTodo[]>>;
  todos: CreationTodo[];
  setTodoSortOrder: (todos: CreationTodo[]) => CreationTodo[];
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