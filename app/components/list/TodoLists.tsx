import { Link } from '@remix-run/react'
import React from 'react'
// import TodoLists from './TodoLists';
import { EditIcon } from '../utilities/icons';
import ListCardV2 from '~/components/card/ListCardV2'

import type { ListAndToDos } from '~/types/listTypes';
import HeadingH1 from '../headers/HeadingH1';
import TextBtn from '../buttons/TextBtn';
import HeadingH2 from '../headers/HeadingH2';

interface TodoListsProps {
  lists: ListAndToDos[],
  headingSize?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6'
  headingText?: string
  linkText?: string
}

function TodoLists({ lists, headingSize = 'H1', headingText = 'To Do Lists', linkText = 'new' }: TodoListsProps) {

  let heading =
    headingSize === 'H1' ? (
      <HeadingH1 H1Title={headingText} />
    ) : headingSize === 'H2' ? (
      <HeadingH2 text={headingText} />
    ) : null


  return (
    <>
      <article className="w-full ">
        <div className='flex gap-8 items-baseline '>
          {heading}
          <Link to={linkText} >
            <TextBtn
              text='Create New To-Do List'
              onClickFunction={() => { }}
              icon={EditIcon}
              textColorDaisyUI='primary'
            />
          </Link>
        </div>

        <div className='flex flex-wrap gap-4 mt-8  '>
          {lists?.map((list: ListAndToDos) => (
            <div key={list.id} className='flex-1-1-[300px]'>
              <ListCardV2
                list={list}
              />
            </div>
          ))}
        </div>
      </article>
    </>
  )
}

export default TodoLists