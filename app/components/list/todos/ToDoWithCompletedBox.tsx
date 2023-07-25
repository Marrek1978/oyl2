import React from 'react'
import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles'

import type { Todo } from '~/types/listTypes';

interface ToDoItemProps {
  todoItem: Todo ;
}

const ToDoWithCheckBox: React.FC<ToDoItemProps> = ({ todoItem}) => {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isChecked, setIsChecked] = React.useState(todoItem.complete)

  const borderClass = ToDoItemStylesNoBg({ todo: todoItem })

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    setIsUpdating(true); // Start progress bar
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)

    try{
      fetcher.submit({
        todoId: todoItem.id,
        completeString
      },{
        method: 'POST',
      })
    }catch(error){ throw error}

    setIsUpdating(false);
  };


  return (
    <>
      <div className={` 
        flex w-full gap-4 items-center justify-between
        px-3 py-1 mb-1
        text-left 
        ${borderClass}
      `}>
        <div className={`
          wrap truncate text-ellipsis 
          ${isChecked && 'line-through text-slate-400'}
          `} >
          {todoItem.body}
        </div>

        <div className='flex gap-2 w-max' >
          {todoItem.dueDate && (
            <div className={`text-xs font-medium text-slate-400 self-center
            ${isChecked && 'line-through text-slate-400'}
            `}>
              {format(new Date(todoItem.dueDate), 'EEE, MMM d', { locale: enUS })}
            </div>
          )}

          <div className="form-control">
            <label className="cursor-pointer label">
              {isUpdating && <progress className="progress w-20"></progress>}
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                className="checkbox checkbox-secondary"
                checked={isChecked}
                onClick={() => setIsChecked(!isChecked)}
                disabled={isUpdating} // Disable while updating
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default ToDoWithCheckBox