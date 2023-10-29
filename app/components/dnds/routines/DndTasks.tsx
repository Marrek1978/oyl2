import React from 'react'
import { useFetcher } from '@remix-run/react';

import SortableTask from './SortableTask';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { CreationTask } from '~/types/routineTypes';


interface DndRoutineToDosProps {
  tasks: CreationTask[];
  setTasks: React.Dispatch<React.SetStateAction<CreationTask[]>>;
  setTaskSortOrder: (todos: CreationTask[]) => CreationTask[];
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<CreationTask | null>>;

}


function DndTasks({setTasks, tasks=[], setTaskSortOrder, setIsEditTaskModalOpen, setSelectedTaskIndex, setSelectedTask}: DndRoutineToDosProps) {
 
  const fetcher = useFetcher();

  const { handleDragEnd } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: tasks, setSortableArray: setTasks, saveOrderToDB: false })
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
  
  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleOpeningEditModal = (todoId: string) => {
    const todo = tasks.find(todo => todo.id === todoId) || null;
    const index = tasks.findIndex(todo => todo.id === todoId);
    setSelectedTaskIndex(index);
    setSelectedTask(todo)
    setIsEditTaskModalOpen(true);
  };
 
  return (
    <>
       <DndAndSortableContexts
        handleDragEnd={handleDragEnd}
        sortableArray={tasks}
        isVertical={true}
      >
          {tasks?.map((task) => (
            <SortableTask
              key={task.id}
              id={task.id}
              task={task}
              removeTask={removeTask}
              handleOpenEditModal={handleOpeningEditModal} />
          ))}
       </DndAndSortableContexts>
    </>
  )
}

export default DndTasks