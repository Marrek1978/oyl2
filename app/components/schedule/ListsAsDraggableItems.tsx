import React from 'react'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes';
import { EditIcon } from '../utilities/icons';
// import RoutineCard from '../routines/RoutineCard';
import { Link } from '@remix-run/react';
// import ListCardV2 from '../list/ListCardV2';
import DraggableCard from './DraggableCard';

interface ListsAsDraggableItemsProps {
  loadedToDos: ListAndToDos[];
  loadedRoutines: RoutineAndToDos[];
  handleDragStart: (event: any) => void;
}

export default function ListsAsDraggableItems({ loadedToDos, loadedRoutines, handleDragStart }: ListsAsDraggableItemsProps) {



  return (<>
    <article className="relative w-full  ">
      <div className='flex justify-between items-end content-end mb-6'>
        <div className='text-4xl font-medium font-nanum tracking-wide'>Routines</div>
        <div className='flex gap-4'>
          <Link to='/dash/routines' >
            <button
              className="
              w-full
              btn btn-primary btn-outline rounded-none font-mont">
              Edit Routines
              {EditIcon}
            </button>
          </Link>
          <Link to='/dash/routines/new' >
            <div className=''>
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
      </div>
      <div className='flex flex-wrap gap-6 mt-6'>
        {loadedRoutines?.map((routine: RoutineAndToDos) => (
          <DraggableCard
            key={routine.id}
            list={routine}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </article >


    <article className="relative w-full mt-8  ">
      <div className='flex justify-between items-end content-end mb-6'>
        <div className='text-4xl font-medium font-nanum tracking-wide'>ToDos</div>
        <div className='flex gap-4'>
          <Link to='/dash/todos' >
            <button
              className="
            w-full
            btn btn-primary btn-outline rounded-none font-mont">
              Edit To-Do Lists
              {EditIcon}
            </button>
          </Link>
          <Link to='/dash/todos/new' >
            <button
              className="
            w-full
            btn btn-primary btn-outline rounded-none font-mont">
              Make New To-Do List
              {EditIcon}
            </button>
          </Link>
        </div>
      </div>
      <div className='flex flex-wrap gap-6 mt-6'>
        {loadedToDos?.map((todo: ListAndToDos) => (
          <DraggableCard
            key={todo.id}
            list={todo}
            handleDragStart={handleDragStart}
          />
        ))}
      </div>
    </article>
  </>
  )
}
