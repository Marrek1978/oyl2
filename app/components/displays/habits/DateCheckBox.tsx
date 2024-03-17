import React, { useEffect, useState } from 'react'

type Props = {
  streakDate: Date | null;
  isChecked?: boolean
}

function DateCheckBox({ streakDate, isChecked = false }: Props) {
  const [isCheckedLocal, setIsCheckedLocal] = useState(false)

  useEffect(() => {
    setIsCheckedLocal(isChecked)
  }, [isChecked])

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked)
    setIsCheckedLocal(event.target.checked)
  }

  const inputName = streakDate?.toDateString()

  return (
    <>
      <div className='grid grid-cols-[200px_200px] items-center' >

        <label className="cursor-pointer label">
          <div>{streakDate?.toDateString()}</div>
        </label>
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          className="checkbox checkbox-secondary "
          checked={isCheckedLocal}
          name={inputName}
        />

        {!isCheckedLocal && (
          <input type="hidden" name={inputName} value="off" />
        )}

      </div>
    </>
  )
}

export default DateCheckBox