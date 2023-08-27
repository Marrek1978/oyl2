import { useEffect, useState } from 'react'
import type { RoutineToDo } from '@prisma/client';
import { Link, useFetcher } from '@remix-run/react';

import Divider from '../utilities/Divider';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, downArrowsIcon } from '../utilities/icons';
import RoutineToDoWithCompletedBox from '../routines/RoutineToDoWithCompletedBox';

import type { RoutineAndToDos } from '~/types/routineTypes'

interface RoutineTodosCompletedFormProps {
  routine: RoutineAndToDos
}

function RoutineTodosCompletedForm({ routine }: RoutineTodosCompletedFormProps) {

  const fetcher = useFetcher();
  const todos: RoutineToDo[] = routine.routineToDos;
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isDisableMoveDownBtn, setIsDisableMoveDownBtn] = useState<boolean>(false)


  useEffect(() => {
    const properlySortedTodos = sortTodos(todos);
    const todosBySortOrder = todos.sort((a, b) => a.sortOrder - b.sortOrder)
    const isSorted = properlySortedTodos.every((todo, index) => todo.id === todosBySortOrder[index].id)
    setIsDisableMoveDownBtn(isSorted)
  }, [todos])


  const handleCompletedToBottom = async (): Promise<void> => {
    const completedToDosAtBottom = sortTodos(todos);
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
        title={routine.title}
        linkDestination='edit'
        linkText='EDIT ROUTINE'
        linkColor='text-info'
      >
        <div className='py-6 px-8 font-poppins  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
            {todos.map((todoItem, index) => {
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

          {todos.some(todo => todo.complete === true) && (
            <div>
              <Divider />
              <div className='w-full mt-8 F'>
                {todos.filter(todo => todo.complete).length > 0
                  && todos.filter(todo => !todo.complete).length > 0
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

export default RoutineTodosCompletedForm


function sortTodos(todos: RoutineToDo[]): RoutineToDo[] {
  const todosCopy = [...todos]

  todosCopy.sort((a, b) => {
    if (a.complete && b.complete) {
      return 0;
    } else if (a.complete && !b.complete) {
      return 1;
    } else if (!a.complete && b.complete) {
      return -1;
    } else { return 0; }
  })

  return resetRoutineTodosSortOrder(todosCopy)
}

function resetRoutineTodosSortOrder(todos: RoutineToDo[]): RoutineToDo[] {

  return todos.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    }
  })

}