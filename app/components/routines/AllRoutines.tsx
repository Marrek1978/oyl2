import React from 'react'
import { Link } from '@remix-run/react'

import { EditIcon } from '../utilities/icons'
import RoutineCard from './RoutineCard'
import type { RoutineAndToDos } from '~/types/routineTypes'
import HeadingH1 from '../titles/HeadingH1'
import HeadingH2 from '../titles/HeadingH2'
import TextBtn from '../buttons/TextBtn'

interface AllRoutinesProps {
  routines: RoutineAndToDos[]
  headingSize?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6'
  headingText?: string
  linkText?: string
}

function AllRoutines({ routines, headingSize = 'H1', headingText = 'Routines', linkText='new' }: AllRoutinesProps) {

  let heading =
    headingSize === 'H1' ? (
      <HeadingH1 text={headingText} />
    ) : headingSize === 'H2' ? (
      <HeadingH2 text={headingText} />
    ) : null

  return (
    <>
      <article className="relative w-full  ">
        <div className='flex gap-8 items-baseline '>
          {heading}
          <Link to={linkText} >
            <TextBtn
              text='Create New Routine'
              onClickFunction={() => { }}
              icon={EditIcon}
              color='text-primary'
            />
          </Link>
        </div>
 
        <div className='flex flex-wrap gap-4 mt-8 '>
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