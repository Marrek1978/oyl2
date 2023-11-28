import React from 'react'
import InputLabel from './inputFieldLabel'

type Props = {
  inputFieldLabel: string
  fieldName: string
  defaultValue: string | number | undefined
  placeholder: string
  validationErrors?: string
}

function TextAreaInputField({ inputFieldLabel, fieldName, defaultValue, placeholder, validationErrors }: Props) {

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