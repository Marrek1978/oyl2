import React from 'react'

import ListCardBg from './ListCardBg';
import ListCardToDoItem from './todos/ListCardToDoItem';

import type { ListAndToDos } from '~/types/listTypes';
import type { ListToDo } from '@prisma/client';
import { useLocation } from '@remix-run/react';

interface ListCardProps {
  listItem: ListAndToDos;

}


const ListCardV2: React.FC<ListCardProps> = ({ listItem }) => {

  const location = useLocation()

  const listTitle = listItem.title
  const todosArray: ListToDo[] = listItem.todos
  const id = listItem.id

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