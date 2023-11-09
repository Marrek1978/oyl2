import React from 'react'

import ListCardBg from './ListCardBg';
import ListCardToDoItem from './todos/ListCardToDoItem';

import type { ListAndToDos } from '~/types/listTypes';
import type { ToDo } from '@prisma/client';
import { useLocation } from '@remix-run/react';

interface ListCardProps {
  list: ListAndToDos;

}


const ListCardV2: React.FC<ListCardProps> = ({ list }) => {

  const location = useLocation()

  const listTitle = list.title
  const todosArray: ToDo[] = list.todos
  const id = list.id

  let relativeUrl =  location.pathname === '/dash/lists' ? `${id}` :  `lists/${id}`


  return (
    <>
      <ListCardBg
        title={listTitle}
        maxWidthTailWindSize='md'
        linkUrl={relativeUrl}
      >
        < div className="mx-6 my-4 max-h-32" >
          {todosArray.map((todoObj, index) => {
            return (
              <ListCardToDoItem
                key={index}
                todoObject={todoObj}
              />
            )
          })}
        </ div>
      </ListCardBg>
    </>
  )
}

export default ListCardV2