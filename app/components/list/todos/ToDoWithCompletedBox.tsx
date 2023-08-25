import React, { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles'

import type { Todo } from '~/types/listTypes';
import Modal from '~/components/modals/Modal';
import ErrorMessage from '~/components/modals/ErrorMessage';
// import SuccessMessage from '~/components/modals/SuccessMessage';

interface ToDoItemProps {
  todoItem: Todo;
}

const ToDoWithCheckBox: React.FC<ToDoItemProps> = ({ todoItem }) => {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState(todoItem.complete)
  const [errorMessage, setErrorMessage] = useState<string>()
  // const [successMessage, setSuccessMessage] = useState<string>()

  const borderClass = ToDoItemStylesNoBg({ todo: todoItem })

  useEffect(() => {
    if(fetcher.data === 'success' && fetcher.state === 'idle'){
      setIsUpdating(false)
      // setSuccessMessage('ToDo updated successfully!');
      // setTimeout(() => setSuccessMessage(''), 500);
    }

    if (fetcher.data === 'failed' && fetcher.state === 'idle') {
      setIsUpdating(false)
      setErrorMessage('Failed to update todo completed status')
      setTimeout(() => setErrorMessage(''), 1000);
    }
  }, [fetcher])

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    setIsUpdating(true); // Start progress bar
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)

    try {
      fetcher.submit({
        todoId: todoItem.id,
        completeString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
  };


  return (
    <>
      {errorMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <ErrorMessage
            text={errorMessage}
          />
        </Modal>
      )}
      
      {/* {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <SuccessMessage
            text={successMessage}
          />
        </Modal>
      )} */}

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
              {isUpdating && <span className="loading loading-ring loading-md"></span>}
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