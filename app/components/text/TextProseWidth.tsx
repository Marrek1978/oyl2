import React from 'react'

interface Props {
  text: string;
  textSize?: string;
  textColor?: string;
}

function TextProseWidth({ text, textSize = 'text-base', textColor = 'para-color' }: Props) {
  return (
    <>
      <div className={`
       w-prose max-w-prose
        ${textSize}
        ${textColor}
      `} >
        {text}
      </div>
    </>
  )
}

export default TextProseWidth
