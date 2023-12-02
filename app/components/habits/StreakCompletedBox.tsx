import { useFetcher } from '@remix-run/react';
import React, { useState } from 'react'

type Props = {
  streakDate: Date | null;

}

function StreakCompletedBox({ streakDate }: Props) {
  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChecked, setIsChecked] = useState()

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUpdating(true); // Start progress bar
    // setIsDisableAllBtns(true); // Disable all other checkboxes
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)
    // try {
    //   fetcher.submit({
    //     todoId: todoItem.id,
    //     completeString
    //   }, {
    //     method: 'POST',
    //   })
    // } catch (error) { throw error }
  };


  return (
    <>
      <div className='grid grid-cols-2' >

        <div>{streakDate?.toDateString()}</div>

        <div className="form-control">
          <label className="cursor-pointer label">
            {/* {isUpdating && <span className="loading loading-ring loading-md"></span>} */}
            <input
              type="checkbox"
              onChange={handleCheckboxChange}
              className="checkbox checkbox-secondary "
              checked={isChecked}
            // onClick={() => setIsChecked(!isChecked)}
            // disabled={isUpdating || isDisableAllBtns} // Disable while updating
            />
          </label>
        </div>

      </div>
    </>
  )
}

export default StreakCompletedBox