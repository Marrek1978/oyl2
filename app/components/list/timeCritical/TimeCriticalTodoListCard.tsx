import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import ListCardToDoItem from '../todos/ListCardToDoItem'
import type  { ToDosWithListInfo } from '../../today/DisplayImportantLists'
import TimeCriticalTodoListCardBg from './TimeCriticalListCardBg';

type Props = {
  toDosWithListInfo: ToDosWithListInfo[];
  ListTitle?: string;
  maxWidthTailWindSize?: string;
  daisyUIBackgroundColor?: string;
  daisyUITextColor?: string;
}

function TimeCriticalTodoListCard({ toDosWithListInfo, ListTitle='ToDos',  maxWidthTailWindSize='md' , daisyUIBackgroundColor, daisyUITextColor}: Props) {

  return (
    <>
      <TimeCriticalTodoListCardBg
        title={ListTitle}
        maxWidthTailWindSize={'xs'}
        linkUrl={'dash/todos'}
        daisyUIBackgroundColor={daisyUIBackgroundColor}
        daisyUITextColor={daisyUITextColor}
      >
        < div className="mx-6 my-4 max-h-32" >
          {toDosWithListInfo.map((todoObj, index) =>
            todoObj.todos.map((todo) =>

            (
              <ListCardToDoItem
                key={ uuidv4()}
                todoObject={todo}
              />
              // <div key={index}>Yolo</div>
            ))
          )}
        </ div>
      </TimeCriticalTodoListCardBg>
    </>
  )
}

export default TimeCriticalTodoListCard