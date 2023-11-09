import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles';

import type { Task, ToDo } from '@prisma/client';
import type { ActionItem } from './ListRoutineCard';
import { useEffect, useState } from 'react';

type Props = {
  item: ActionItem
  actionItemsType: 'todos' | 'tasks' | undefined
}


function TaskTodoItem({ item, actionItemsType }: Props) {

  const [actionItem, setActionItem] = useState<ToDo | Task>(item)
  //if todo, then use todo styling

  useEffect(() => {
    if (actionItemsType === 'todos') setActionItem(item as ToDo)
    if (actionItemsType === 'tasks') setActionItem(item as Task)
  }, [item, actionItemsType])

  let priorityStyling;

  if (actionItemsType === 'todos' && 'isUrgent' in item && 'isImportant' in item) {
    ToDoItemStylesNoBg({ todo: item })
  }

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
          ${actionItem.isComplete && 'line-through text-slate-300'}
        `} >
          {actionItem.body}
        </div>

        {'dueDate' in actionItem && actionItem.dueDate !== null && (
          <div className={` text-xs font-medium text-base-content/60 self-center ${item.isComplete && 'line-through text-slate-300'}`}>
            {format(new Date(actionItem.dueDate), 'EEE, MMM d', { locale: enUS })}
          </div>
        )}
      </div>

    </>
  )
}

export default TaskTodoItem