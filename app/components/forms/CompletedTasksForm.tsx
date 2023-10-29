import type { Task } from '@prisma/client';
import { useEffect, useState } from 'react'
import { Link, useFetcher } from '@remix-run/react';

import Divider from '../utilities/Divider';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, downArrowsIcon } from '../utilities/icons';
import RoutineToDoWithCompletedBox from '../routines/RoutineToDoWithCompletedBox';

import type { RoutineAndTasks } from '~/types/routineTypes'

interface CompletedTasksFormProps {
  routine: RoutineAndTasks
}

function CompletedTasksForm({ routine }: CompletedTasksFormProps) {

  const fetcher = useFetcher();
  const tasks: Task[] = routine.tasks;
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isDisableMoveDownBtn, setIsDisableMoveDownBtn] = useState<boolean>(false)


  useEffect(() => {
    const properlySortedTodos = sortTodos(tasks);
    const tasksBySortOrder = tasks.sort((a, b) => a.sortOrder - b.sortOrder)
    const isSorted = properlySortedTodos.every((task, index) => task.id === tasksBySortOrder[index].id)
    setIsDisableMoveDownBtn(isSorted)
  }, [tasks])


  const handleCompletedToBottom = async (): Promise<void> => {
    const completedToDosAtBottom = sortTodos(tasks);
    const completedToDosAtBottomString = JSON.stringify(completedToDosAtBottom)
    try {
      fetcher.submit({
        routineToDos: completedToDosAtBottomString,
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
  };


  return (
    <>
      <BasicFormAreaBG
        h2Text={routine.title}
        linkDestination='edit'
        linkText='EDIT ROUTINE'
        linkColorDaisyUI='info'
      >
        <div className='py-6 px-8 font-poppins  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
            {tasks.map((todoItem, index) => {
              return (
                <RoutineToDoWithCompletedBox
                  key={todoItem.id}
                  routineToDoItem={todoItem}
                  setIsDisableAllBtns={setIsDisableAllBtns}
                  isDisableAllBtns={isDisableAllBtns}
                />
              )
            })}
          </div>

          {tasks.some(task => task.isComplete === true) && (
            <div>
              <Divider />
              <div className='w-full mt-8 F'>
                {tasks.filter(task => task.isComplete).length > 0
                  && tasks.filter(task => !task.isComplete).length > 0
                  && (<>
                    <OutlinedBtn
                     text='Move Completed To-Dos Down'
                      onClickFunction={handleCompletedToBottom}
                      daisyUIBtnColor='primary'
                      icon={downArrowsIcon}
                      disabledBtnBoolean={isDisableMoveDownBtn || isDisableAllBtns}
                    />
                  </>
                  )}
              </div>
            </div>
          )}

          <div className='w-full mt-8 flex gap-8 '>
            <div className='w-full flex-1 '>
              <Link to='delete' >
                <OutlinedBtn
                  text='Delete Routine'
                  onClickFunction={() => { }}
                  daisyUIBtnColor='error'
                  disabledBtnBoolean={isDisableAllBtns}
                />
              </Link>
            </div>

            <div className='w-full flex-1 '>
              <Link to='..' >
                <SolidBtnGreyBlue text='Close'
                  onClickFunction={() => { }}
                  icon={closeIcon}
                  disabledBtnBoolean={isDisableAllBtns}
                />
              </Link>
            </div>
          </div>

        </div>
      </BasicFormAreaBG>


    </>
  )
}

export default CompletedTasksForm


function sortTodos(tasks: Task[]): Task[] {
  const tasksCopy = [...tasks]

  tasksCopy.sort((a, b) => {
    if (a.isComplete && b.isComplete) {
      return 0;
    } else if (a.isComplete && !b.isComplete) {
      return 1;
    } else if (!a.isComplete && b.isComplete) {
      return -1;
    } else { return 0; }
  })

  return resetRoutineTodosSortOrder(tasksCopy)
}

function resetRoutineTodosSortOrder(tasks: Task[]): Task[] {

  return tasks.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    }
  })

}