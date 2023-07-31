import React from 'react'

interface Props {
  text: string;
  textSize?: string;
  textColor?: string;
}

function TextProseWidth({ text, textSize = 'text-base', textColor = 'text-base-content/70' }: Props) {
  return (
    <>
      <div className={`
        max-w-prose w-prose 
        ${textSize}
        ${textColor}
      `} >
        {text}
      </div>
    </>
  )
}

export default TextProseWidth
