import { Link } from '@remix-run/react'
import React from 'react'
// import TodoLists from './TodoLists';
import { EditIcon } from '../utilities/icons';
import ListCardV2 from '~/components/list/ListCardV2'

import type { ListAndToDos } from '~/types/listTypes';
import HeadingH1 from '../titles/HeadingH1';
import TextBtn from '../buttons/TextBtn';
import HeadingH2 from '../titles/HeadingH2';

interface TodoListsProps {
  lists: ListAndToDos[],
  headingSize?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6'
  headingText?: string
}

function TodoLists({ lists, headingSize = 'H1', headingText = 'To Do Lists' }: TodoListsProps) {

  let heading =
    headingSize === 'H1' ? (
      <HeadingH1 text={headingText} />
    ) : headingSize === 'H2' ? (
      <HeadingH2 text={headingText} />
    ) : null


  return (
    <>
      <article className="w-full ">
        <div className='flex gap-8 items-baseline '>
          {heading}
          <Link to='new' >
            <TextBtn
              text='Create New To-Do List'
              onClickFunction={() => { }}
              icon={EditIcon}
              color='text-primary'
            />
          </Link>
        </div>

        <div className='flex flex-wrap gap-4 mt-8  '>
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