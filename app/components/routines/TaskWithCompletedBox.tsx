import { useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react'

import Modal from '~/components/modals/Modal';
import useFetcherState from '../utilities/useFetcherState';
import ErrorMessage from '~/components/modals/ErrorMessage';

import type { RoutineToDo } from '~/types/routineTypes';

interface RoutineToDoWithCompletedBoxProps {
  task: RoutineToDo;
  setIsDisableAllBtns: React.Dispatch<React.SetStateAction<boolean>>
  isDisableAllBtns: boolean
}

const TaskWithCompletedBox: React.FC<RoutineToDoWithCompletedBoxProps> = ({ task, setIsDisableAllBtns, isDisableAllBtns }) => {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isChecked, setIsChecked] = useState(task.isComplete)

  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher })


  useEffect(() => {
    if (fetcherMessage === 'success' && fetcherState === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
    }

    if (fetcherMessage === 'failed' && fetcherState === 'idle') {
      setIsUpdating(false)
      setIsDisableAllBtns(false);
      setErrorMessage('Failed to update task  status')
      setTimeout(() => setErrorMessage(''), 1000);
    }
  }, [fetcherMessage, fetcherState, setIsDisableAllBtns])


  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUpdating(true); // Start progress bar
    setIsDisableAllBtns(true);
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)
    try {
      fetcher.submit({
        taskId: task.id,
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
        flex w-full  items-center	justify-between
        px-3 py-1 mb-1
        text-left 
      `}>
        <div className={`
        wrap truncate text-ellipsis 
        ${isChecked && 'line-through text-slate-400'}
        `} >
          {task.body}
        </div>

        <div className='flex gap-2' >
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

export default TaskWithCompletedBox