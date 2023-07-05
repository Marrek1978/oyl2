import React from 'react'
import { Link } from '@remix-run/react'

import { EditIcon } from '../utilities/icons'
import RoutineCard from './RoutineCard'
import type { RoutineAndToDos } from '~/types/routineTypes'

interface AllRoutinesProps {
  routines: RoutineAndToDos[]
}

function AllRoutines({ routines }: AllRoutinesProps) {

  return (
    <>
      <article className="relative w-full  ">
        <div className='flex justify-between items-end content-end mb-12'>
          <div className='text-4xl font-medium font-nanum tracking-wide'>Routines</div>
          <Link to='/dash/routines/new' >
            <div className='w-72'>
              <button
                className="
                w-full
                btn btn-primary btn-outline rounded-none font-mont">
                Make New Routine
                {EditIcon}
              </button>
            </div>
          </Link>
        </div>
        <div className='flex flex-wrap gap-6 mt-6'>
          {routines?.map((routine: RoutineAndToDos) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
            />
          ))}
        </div>
      </article>
    </>
  )
}

export default AllRoutines