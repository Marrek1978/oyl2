import ListCardToDoItem from '../todos/ListCardToDoItem'
import TimeCriticalTodoListCardBg from './TimeCriticalListCardBg';

import type { ToDo } from '@prisma/client';
import type { maxWidthTW } from '~/types/CSSTypes';

type Props = {
  toDos: ToDo[];
  ListTitle?: string;
  maxWidthTailWindSize?: maxWidthTW;
  linkUrl: string;
  due?: 'past' | 'today' | 'upcoming';
}

function TimeCriticalTodoListCard({ toDos, ListTitle = 'ToDos', maxWidthTailWindSize = 'max-w-md', linkUrl, due }: Props) {
  return (
    <>
      <TimeCriticalTodoListCardBg
        title={ListTitle}
        maxWidthTailWindSize={maxWidthTailWindSize}
        linkUrl={linkUrl}
      >
        < div className="mx-6 my-4 max-h-32" >
          {toDos.map((todo: any) =>
          (
            <ListCardToDoItem
              key={todo.id}
              todoObject={todo}
              due={due}
            />
          )
          )}

        </ div>
      </TimeCriticalTodoListCardBg>
    </>
  )
}

export default TimeCriticalTodoListCard