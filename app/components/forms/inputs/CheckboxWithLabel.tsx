import ListLabel from './ListLabel';
import { arrowLeftCircle } from '../../utilities/icons';

import type { NumTimesValueServedType } from '~/routes/dash.desires';
import { useEffect, useState } from 'react';

type Props = {
  id: string;
  label: string;
  checkedValues: string[];
  handleCheckboxChange: (valueTitle: string) => void;
  notYetUsed?: boolean
  numTimesValueServed?: NumTimesValueServedType
}

function CheckboxWithLabel({ id, label, checkedValues, handleCheckboxChange, notYetUsed = false, numTimesValueServed }: Props) {
  const [numTimesUsed, setNumTimesUsed] = useState<number>(0)

  useEffect(() => {
    if (!numTimesValueServed) return
    const key = Object.keys(numTimesValueServed)[0]
    const numOnly = numTimesValueServed[key]
    setNumTimesUsed(numOnly)
  }, [numTimesValueServed])


  const toggleCheckbox = () => {
    handleCheckboxChange(label)
  }

  let borderColor = checkedValues.includes(label) ? 'border-secondary' : 'border-base-300'

  return (
    <>
      <div className='flex gap-x-4 items-center'>
        <div key={id}
          className={`
          flex gap-4 max-w-max 
          px-4 
          bg-base-200 
          border-2 ${borderColor} 
          hover:cursor-pointer
          `}
          onClick={toggleCheckbox}
        >
          <div className='label ' onClick={toggleCheckbox}>
            <input
              type="checkbox"
              className="checkbox checkbox-secondary self-center "
              name={`value-${id}`}
              checked={checkedValues.includes(label)}
              onChange={() => handleCheckboxChange(label)}
            />
          </div>
          <div className="hover:cursor-pointer" >
            <ListLabel text={label} />
          </div>

        </div>
        {notYetUsed && (
          <div className='text-xs text-error font-bold flex gap-x-2 items-center '>{arrowLeftCircle}Not yet served.</div>
        )}

        {numTimesUsed > 0 && (
          <div className='text-xs text-secondary font-bold flex gap-x-2 items-center '>{arrowLeftCircle}Served {numTimesUsed} times.</div>

        )}
      </div>

    </>
  )
}

export default CheckboxWithLabel