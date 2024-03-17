import React from 'react'
import { useFetcher } from '@remix-run/react';

import SortableTask from './SortableTask';
import useFetcherState from '~/components/utilities/useFetcherState';
import useServerMessages from '~/components/displays/modals/useServerMessages';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { CreationTask } from '~/types/routineTypes';
import type { HasSortOrder } from '~/types/genericDndArrayTypes';


interface DndRoutineToDosProps {
  tasks: CreationTask[];
  setTasks: React.Dispatch<React.SetStateAction<CreationTask[]>>;
  setTaskSortOrder: <T extends HasSortOrder>(tasks: T[]) => T[];
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<CreationTask | null>>;

}


function DndTasks({ setTasks, tasks = [], setTaskSortOrder, setIsEditTaskModalOpen, setSelectedTaskIndex, setSelectedTask }: DndRoutineToDosProps) {

  const fetcher = useFetcher();

  const { handleDragEnd } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: tasks, setSortableArray: setTasks, saveOrderToDB: false })
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })


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