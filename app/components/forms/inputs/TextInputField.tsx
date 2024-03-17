import InputLabel from './InputLabel'
import type { Dispatch, SetStateAction } from 'react'

type Props = {
  inputFieldLabel: string
  inputType: string
  fieldName: string
  defaultValue: string | number | undefined
  validationErrors?: string
  onChangeSetter: Dispatch<SetStateAction<string | number | undefined>>
}

function TextInputField({ inputFieldLabel, inputType, fieldName, defaultValue, validationErrors, onChangeSetter }: Props) {
  const inputLabelComponent = InputLabel({ inputLabel: inputFieldLabel })

  return (
    <>
      <div className="flex items-center flex-row gap-4">
        <div className='flex-1'>
          {inputLabelComponent}
        </div>
        <div className='flex-1 max-w-max' >
          <input
            type={inputType}
            className='input-field-text-title'
            name={fieldName}
            defaultValue={defaultValue}
            onChange={(e) => onChangeSetter(e.target.value)}
            min={1}
            max={150}
          />
        </div >
      </div >
      {validationErrors && (
        <div className='text-red-700'> {validationErrors}</div>
      )
      }
    </>
  )
}

export default TextInputField