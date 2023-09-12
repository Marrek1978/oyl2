import { useState } from 'react'
import ListLabel from './ListLabel';

type Props = {
  id: string;
  label: string;
  checkedValues: string[];
  handleCheckboxChange: (valueTitle: string) => void;

}

function CheckboxWithLabel({ id, label, checkedValues, handleCheckboxChange }: Props) {

  const [isChecked, setIsChecked] = useState(false)

  const toggleCheckbox = () => {
    setIsChecked(!isChecked)
    handleCheckboxChange(label)
  }

  let borderColor = isChecked ? 'border-secondary' : 'border-base-300'

  return (
    <>
      <div key={id}
        className={`
          flex gap-4 max-w-max 
          px-4 mb-2
          bg-base-200 
          border-2 ${borderColor} 
          hover:cursor-pointer
          `}
        onClick={toggleCheckbox}
          >
        <div className='label  '>
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
    </>
  )
}

export default CheckboxWithLabel