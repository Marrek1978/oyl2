import { useFetcher, useSearchParams } from '@remix-run/react';
import React, { useEffect, useState } from 'react'

import { format } from 'date-fns'
import { enUS } from 'date-fns/locale';

import Modal from '~/components/displays/modals/Modal';
import ErrorMessage from '~/components/displays/modals/ErrorMessage';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles'
import useFetcherState from '~/components/utilities/useFetcherState';

import type { ToDo } from '@prisma/client';
import type { DaisyUIColor } from '~/types/CSSTypes';


interface ToDoItemProps {
  todoItem: ToDo;
  setIsDisableAllBtns: React.Dispatch<React.SetStateAction<boolean>>
  isDisableAllBtns: boolean
  daisyUIItemsColor?: DaisyUIColor;
}

const ToDoWithCheckBox: React.FC<ToDoItemProps> = ({ todoItem, setIsDisableAllBtns, isDisableAllBtns, daisyUIItemsColor = 'text-base-content' }) => {
  const fetcher = useFetcher();

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState(todoItem.isComplete)
  const [errorMessage, setErrorMessage] = useState<string>()

  let textColorClass = ToDoItemStylesNoBg({ todo: todoItem })
  if (textColorClass === 'text-base-content') {
    if (type === '<') textColorClass = 'text-accent-focus'
    if (type === '=') textColorClass = 'text-success'
  }
  
  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher })

  useEffect(() => {
    if (fetcherMessage === 'success' && fetcherState === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
    }

    if (fetcherMessage === 'failed' && fetcherState === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
      setErrorMessage('Failed to update to-do status')
      setTimeout(() => setErrorMessage(''), 1000);
    }
  }, [fetcherMessage, fetcherState, setIsDisableAllBtns])


  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('checkbox clicked')
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
        flex gap-4 items-center justify-between
        w-full max-w-xl
        px-3 py-0 mb-0
        text-left 
        font-mont
        ${textColorClass}
      `}>
        <div className={`
          wrap truncate text-ellipsis capitalize
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


{/* //!!! add link to list here */}

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