import React from 'react'

import ListCardBg from './ListCardBg';
import ListCardToDoItem from './todos/ListCardToDoItem';

import type { ListAndToDos } from '~/types/listTypes';
import type { ListToDo } from '@prisma/client';

interface ListCardProps {
  listItem: ListAndToDos;
}


const ListCardV2: React.FC<ListCardProps> = ({
  listItem,
}) => {

  const listTitle = listItem.title
  const todosArray: ListToDo[] = listItem.todos
  const listId = listItem.id

  return (
    <>
      <ListCardBg
        title={listTitle}
        maxWidth='400px'
        listId={listId}
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