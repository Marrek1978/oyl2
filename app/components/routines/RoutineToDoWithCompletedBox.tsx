import { useFetcher } from '@remix-run/react';
import React, { useState } from 'react'
import type { RoutineToDo } from '~/types/routineTypes';

interface RoutineToDoWithCompletedBoxProps {
  routineToDoItem: RoutineToDo ;
 
}

const RoutineToDoWithCompletedBox:React.FC<RoutineToDoWithCompletedBoxProps> = ({routineToDoItem}) => {
  
  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState(routineToDoItem.complete)


  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    console.log('handleCheckboxChange')
    setIsUpdating(true); // Start progress bar
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)

    try{
      fetcher.submit({
        routineToDoId: routineToDoItem.id,
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

export default RoutineToDoWithCompletedBox