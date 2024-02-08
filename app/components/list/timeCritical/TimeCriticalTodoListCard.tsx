import { v4 as uuidv4 } from 'uuid';
import ListCardToDoItem from '../todos/ListCardToDoItem'
import TimeCriticalTodoListCardBg from './TimeCriticalListCardBg';

import type { maxWidthTW } from '~/types/CSSTypes';
import type { ToDosWithListInfo } from '../../today/DisplayImportantLists'

type Props = {
  toDosWithListInfo: ToDosWithListInfo[];
  ListTitle?: string;
  maxWidthTailWindSize?: maxWidthTW;
  linkUrl: string;
  due?: 'past' | 'today' | 'upcoming';
}

function TimeCriticalTodoListCard({ toDosWithListInfo, ListTitle = 'ToDos', maxWidthTailWindSize = 'max-w-md',linkUrl, due }: Props) {

  return (
    <>
      <TimeCriticalTodoListCardBg
        title={ListTitle}
        maxWidthTailWindSize={maxWidthTailWindSize}
        linkUrl={linkUrl}
      >
        < div className="mx-6 my-4 max-h-32" >
          {toDosWithListInfo.map((todoObj, index) =>
            todoObj.todos.map((todo) =>
            (
              <ListCardToDoItem
                key={uuidv4()}
                todoObject={todo}
                due={due}
              />
            ))
          )}
        </ div>
      </TimeCriticalTodoListCardBg>
    </>
  )
}

export default TimeCriticalTodoListCard