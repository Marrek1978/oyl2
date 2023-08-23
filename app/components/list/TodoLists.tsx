import { Link } from '@remix-run/react'
import React from 'react'
// import TodoLists from './TodoLists';
import { EditIcon } from '../utilities/icons';
import ListCardV2 from '~/components/list/ListCardV2'

import type { ListAndToDos } from '~/types/listTypes';
import HeadingH1 from '../titles/HeadingH1';
import TextBtn from '../buttons/TextBtn';

interface TodoListsProps {
  lists: ListAndToDos[]
}

function TodoLists({ lists }: TodoListsProps) {
  return (
    <>
      <article className="w-full ">
        <div className='flex gap-8 items-baseline '>
          <HeadingH1 text='To-Do Lists' />
          <Link to='/dash/todos/new?todo=new' >
            <TextBtn
              text='Create New List'
              onClickFunction={() => { }}
              icon={EditIcon}
              color='text-primary'
            />
          </Link>

        </div>
        <div className='flex flex-wrap gap-4 mt-8   '>
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