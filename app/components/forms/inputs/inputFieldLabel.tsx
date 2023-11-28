import React from 'react'

type Props = {
  inputLabel: string
}

function InputLabel({ inputLabel }: Props) {
  return (
    <label className="label">
      <span className="label-text text-base font-mont font-medium">{inputLabel}</span>
    </label>
  )
}

export default InputLabel