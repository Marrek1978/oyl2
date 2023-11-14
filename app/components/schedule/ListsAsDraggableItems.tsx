import { Link } from '@remix-run/react';

import DraggableCard from './DraggableCard';
import { EditIcon } from '../utilities/icons';

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes';

interface ListsAsDraggableItemsProps {
  loadedToDos: ListAndToDos[];
  loadedRoutines: RoutineAndTasks[];
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
        {loadedRoutines?.map((routine: RoutineAndTasks) => (
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
