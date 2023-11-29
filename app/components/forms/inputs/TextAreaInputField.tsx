import React from 'react'
import InputLabel from './inputFieldLabel'
import type { Dispatch, SetStateAction } from 'react'


type Props = {
  inputFieldLabel: string
  fieldName: string
  defaultValue: string | number | undefined
  placeholder: string
  validationErrors?: string
  onChangeSetter: Dispatch<SetStateAction<string | number | undefined>>
}

function TextAreaInputField({ inputFieldLabel, fieldName, defaultValue, placeholder, validationErrors , onChangeSetter}: Props) {

  const inputFieldLabelComponent = InputLabel({ inputLabel: inputFieldLabel })

  return (
    <>
      <div className="form-control gap-4">
        <div>
          {inputFieldLabelComponent}
          <textarea
            className='input-field-text-para'
            placeholder={placeholder}
            name={fieldName}
            defaultValue={defaultValue}
            onChange={(e) => onChangeSetter(e.target.value)}
          >
          </textarea>
        </div>
      </div>
      {validationErrors && (
        <div className='text-red-700'> {validationErrors}</div>
      )}
    </>
  )
}

export default TextAreaInputField