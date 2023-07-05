import type { RoutineToDos } from '@prisma/client';
import { Link, useFetcher } from '@remix-run/react';
import React from 'react'
import type { RoutineAndToDos } from '~/types/routineTypes'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { EditIcon, closeIcon, downArrowsIcon, trashIcon } from '../utilities/icons';
// import ToDoWithCompletedBox from '../list/todos/ToDoWithCompletedBox';
import Divider from '../utilities/Divider';
import TextBtn from '../buttons/TextBtn';
import RoutineToDoWithCompletedBox from '../routines/RoutineToDoWithCompletedBox';


interface RoutineTodosCompletedFormProps {
  routine: RoutineAndToDos
}

function RoutineTodosCompletedForm({ routine }: RoutineTodosCompletedFormProps) {

  const fetcher = useFetcher();
  const todos = routine.routineToDos;

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
      <div className='
          bg-base-100 
          grid grid-cols-[minmax(300px,600px)] grid-rows-[72px_1fr_min-content]
          cursor-default
        '>
        <div className='w-full h-full px-8 bg-base-content flex justify-between items-center'>
          <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              `}>
            {routine.title}
          </div>
          <Link to='edit'>
            <div className='flex gap-2 items-center 
                font-mont font-bold text-info
                hover:scale-105 transition-all
                 '>
              Edit {EditIcon}
            </div>
          </Link>
        </div>

        <div className='py-6 px-8 font-poppins  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
            {todos.map((todoItem, index) => {
              return <RoutineToDoWithCompletedBox
                key={todoItem.id}
                routineToDoItem={todoItem}
              />
            })}
          </div>

          <div>
            <Divider />
          </div>

          {todos.some(todo => todo.complete === true) && (
            <div className='w-full mt-8 flex justify-between items-center'>
              <div className='text-base font-mont font-semibold'>Completed To-Dos</div>
              <div>
                {todos.filter(todo => todo.complete).length > 0
                  && todos.filter(todo => !todo.complete).length > 0
                  && (
                    <TextBtn
                      text={'Move Down'}
                      icon={downArrowsIcon}
                      onClickFunction={handleCompletedToBottom}
                    />
                  )}
              </div>
            </div>
          )}

          <div className='w-full mt-6 flex gap-6 '>
            <div className='w-full flex-1 '>
              <Link to='delete' >
                <button className='btn btn-error btn-outline  
                w-full
                rounded-none
                font-mont font-semibold
              ' >
                  Delete Routine
                  {trashIcon}
                </button>
              </Link>
            </div>

            <div className='w-full flex-1 '>
              <Link to='..' >
                <SolidBtnGreyBlue text='Close'
                  onClickFunction={() => { }}
                  icon={closeIcon}
                />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default RoutineTodosCompletedForm


function sortTodos(todos: RoutineToDos[]): RoutineToDos[] {
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

function resetRoutineTodosSortOrder(todos: RoutineToDos[]): RoutineToDos[] {

  return todos.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    }
  })

}