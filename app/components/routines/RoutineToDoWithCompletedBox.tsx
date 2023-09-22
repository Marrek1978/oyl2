import { useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react'
import type { RoutineToDo } from '~/types/routineTypes';
import Modal from '../modals/Modal';
import ErrorMessage from '../modals/ErrorMessage';

interface RoutineToDoWithCompletedBoxProps {
  routineToDoItem: RoutineToDo;
  setIsDisableAllBtns: React.Dispatch<React.SetStateAction<boolean>>
  isDisableAllBtns: boolean
}

const RoutineToDoWithCompletedBox: React.FC<RoutineToDoWithCompletedBoxProps> = ({ routineToDoItem, setIsDisableAllBtns, isDisableAllBtns }) => {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState(routineToDoItem.complete)
  const [errorMessage, setErrorMessage] = useState<string>()


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
    setIsDisableAllBtns(true);
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)
    try {
      fetcher.submit({
        routineToDoId: routineToDoItem.id,
        completeString
      }, {
        method: 'POST',
        action: '/dash/routines/%24routineId',
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
          {routineToDoItem.body}
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

export default RoutineToDoWithCompletedBox