import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles';

import type { ToDo } from '@prisma/client';

type Props = {
  todoObject: ToDo;
}

function ListCardToDoItem({ todoObject }: Props) {

  const priorityStyling = ToDoItemStylesNoBg({ todo: todoObject })

  return (
    <>

      <div className={` 
        flex w-full gap-4 items-center justify-between
        p-0 m-0
        text-left 
        font-poppins para-color
        ${priorityStyling}
      `}>
        <div className={`
          wrap truncate text-ellipsis 	
          ${todoObject.isComplete && 'line-through text-slate-300'}
        `} >
          {todoObject.body}
        </div>

        {todoObject.dueDate && (
          <div className={` text-xs font-medium text-base-content/60 self-center ${todoObject.isComplete && 'line-through text-slate-300'}`}>
            {format(new Date(todoObject.dueDate), 'EEE, MMM d', { locale: enUS })}
          </div>
        )}
      </div>

    </>
  )
}

export default ListCardToDoItem