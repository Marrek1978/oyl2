import React from 'react'

import type { MaslowCriteria } from '~/types/maslowTypes';


type Props = {
  criteria: MaslowCriteria;
  needNumber: number;
  isAllDisabled: boolean;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function MaslowCheckBoxInput({ criteria, needNumber, isAllDisabled, handleCheckboxChange }: Props) {



  return (
    <div className="flex gap-x-4 items-center justify-between">
      <label className="label pl-0 max-w-prose" htmlFor="checkbox" >
        <span className="label-text " >{criteria.description}</span>
      </label>

      <div className={`flex gap-x-12 max-w-max px-4 hover:cursor-pointer`}  >
        <div className='label mr-6'>
          <input
            type="checkbox"
            id={`${needNumber}`}
            className="checkbox checkbox-error self-center "
            onChange={handleCheckboxChange}
            disabled={isAllDisabled}
          />
        </div>
      </div>
    </div >
  )
}

export default MaslowCheckBoxInput