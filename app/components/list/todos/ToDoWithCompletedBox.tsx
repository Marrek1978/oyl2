import { format } from 'date-fns'
import { enUS } from 'date-fns/locale';
import { useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react'


import type { Todo } from '~/types/listTypes';
import Modal from '~/components/modals/Modal';
import ErrorMessage from '~/components/modals/ErrorMessage';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles'

interface ToDoItemProps {
  todoItem: Todo;
  setIsDisableAllBtns: React.Dispatch<React.SetStateAction<boolean>>
  isDisableAllBtns: boolean
}

const ToDoWithCheckBox: React.FC<ToDoItemProps> = ({ todoItem, setIsDisableAllBtns, isDisableAllBtns }) => {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState(todoItem.complete)
  const [errorMessage, setErrorMessage] = useState<string>()

  const borderClass = ToDoItemStylesNoBg({ todo: todoItem })

  useEffect(() => {
    if (fetcher.data === 'success' && fetcher.state === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
    }

    if (fetcher.data === 'failed' && fetcher.state === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
      setErrorMessage('Failed to update to-do status')
      setTimeout(() => setErrorMessage(''), 1000);
    }
  }, [fetcher, setIsDisableAllBtns])

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUpdating(true); // Start progress bar
    setIsDisableAllBtns(true); // Disable all other checkboxes
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)
    try {
      fetcher.submit({
        todoId: todoItem.id,
        completeString
      }, {
        method: 'POST',
        action: '/dash/lists/$listId',
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
                disabled={isUpdating || isDisableAllBtns} // Disable while updating
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default ToDoWithCheckBox