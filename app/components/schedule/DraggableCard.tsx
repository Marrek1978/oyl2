// import React from 'react'
// import type { Routines } from '@prisma/client';
import type { Task, ToDo } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks, RoutineToDo } from '~/types/routineTypes';

interface DraggableCardProps {
  list: RoutineAndTasks | ListAndToDos;
  handleDragStart: (event: any) => void;
}

function DraggableCard({ list, handleDragStart }: DraggableCardProps) {

  const typeOfList = (list: ListAndToDos | RoutineAndTasks): ToDo[] | Task[] => {
    if ('todos' in list) {
      return list.todos
    } else if ('tasks' in list) {
      return list.tasks
    } else {
      return []
    }
  }

  const title = list.title
  const ToDosArray = typeOfList(list)
  // const id = routine.id

  return (
    <>
      <div
        className="
          flex-[1_1_200px] 
          max-w-[300px] min-w-[150px]
          font-poppins text-primary-content
          truncate 
          pb-3
          shadow-xl
        "
        draggable="true"
        onDragStart={() =>
          handleDragStart(list)
        }
      >
        <div
          className="
          w-full h-[32px]
          flex items-center
          bg-base-content 
          px-4
          flex-shrink-0
          
          ">
          <div className='
            text-primary-300 font-mont uppercase font-medium text-sm  tracking-widest 
            truncate overflow-ellipsis '>
            {title}
          </div>
        </div >

        < div className="mx-4 mt-2 h-16 " >
          {ToDosArray.map((todoObj: ToDo | RoutineToDo, index: number) => {
            return (
              <div
                key={index}
                className={` 
                    flex w-full items-center content-center
                    p-0 m-0
                    text-left 
                    text-base-content
                    `}>
                <div className={`w-full  wrap truncate text-ellipsis	${todoObj.isComplete && 'line-through text-slate-300'}`} >
                  {todoObj.body}
                </div>
              </div>
            )
          })}
        </ div>
      </div >
    </>
  )
}

export default DraggableCard