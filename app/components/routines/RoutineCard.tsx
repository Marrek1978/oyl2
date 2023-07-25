// import React from 'react'
// import type { Routines } from '@prisma/client';
import { Link } from '@remix-run/react';
import { EditIcon } from '../utilities/icons';
import type { RoutineAndToDos } from '~/types/routineTypes';
import type { RoutineToDo } from '@prisma/client';

interface RoutineCardProps {
  routine: RoutineAndToDos;
}

function RoutineCard({ routine }: RoutineCardProps) {

  const title = routine.title
  const routineToDosArray:RoutineToDo[] = routine.routineToDos
  const id = routine.id

  return (
    <>
      <div
        className="
          flex-[1_1_300px] 
          max-w-[400px] min-w-[250px]
          font-poppins text-primary-content
          truncate 
          pb-3
          shadow-xl
        ">
        <div
          className="
          w-full h-[48px]
          flex justify-between items-center  gap-4
          bg-base-content 
          px-6
           flex-shrink-0
          ">
          <div className='
            text-primary-300 font-mont uppercase font-medium text-sm  tracking-widest 
            truncate overflow-ellipsis '>
            {title}
          </div>
          <Link to={'/dash/routines/' + id}>
            <div className='flex gap-2 items-center
                text-info font-mont font-bold text-sm  uppercase
                hover:scale-105 transition-all '>
              OPEN {EditIcon}
            </div>
          </Link>
        </div >

        < div className="mx-6 mt-4 h-48" >
          {routineToDosArray.map((todoObj, index) => {
            return (
              <div
                key={index}
                className={` 
                    flex w-full items-center content-center
                    p-0 m-0
                    text-left 
                    text-base-content
                    `}>
                <div className={` wrap truncate text-ellipsis	${todoObj.complete && 'line-through text-slate-300'}`} >
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

export default RoutineCard