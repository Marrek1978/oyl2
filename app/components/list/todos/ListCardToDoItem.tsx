import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles';
import type { ToDo } from '@prisma/client';

type Props = {
  todoObject: ToDo;
  due?: 'past' | 'today' | 'upcoming';
}

function ListCardToDoItem({ todoObject, due  }: Props) {
  let priorityStyling = ToDoItemStylesNoBg({ todo: todoObject })
  if(due === 'past') priorityStyling = 'text-accent-focus'
  if(due === 'today') priorityStyling = 'text-success'
  if(due === 'upcoming') priorityStyling = 'text-base-content'

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
          wrap truncate text-ellipsis capitalize	
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