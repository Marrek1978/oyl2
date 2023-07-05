import { Link } from '@remix-run/react'
import React from 'react'
// import TodoLists from './TodoLists';
import { EditIcon } from '../utilities/icons';
import ListCardV2 from '~/components/list/ListCardV2'

import type { ListAndToDos } from '~/types/listTypes';
import HeadingH1 from '../titles/HeadingH1';

interface TodoListsProps {
  lists: ListAndToDos[]
}

function TodoLists({ lists }: TodoListsProps) {
  return (
    <>
      <article className="w-full ">
        <div className='flex justify-between items-end content-end '>
          <HeadingH1 text='To-Do Lists' />
          <Link to='/dash/todos/new' >
            <div className='w-72'>
              <button
                className="
                w-full
                btn btn-primary btn-outline rounded-none font-mont">
                Make New To-do List
                {EditIcon}
              </button>
            </div>
          </Link>
        </div>
        <div className='flex flex-wrap gap-6 mt-8'>
          {lists?.map((list: ListAndToDos) => (
            <ListCardV2
              key={list.id}
              listItem={list}
            />
          ))}
        </div>
      </article>
    </>
  )
}

export default TodoLists