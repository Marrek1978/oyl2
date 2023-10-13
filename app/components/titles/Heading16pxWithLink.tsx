import React from 'react'

interface Props {
  text: string | React.ReactNode;
}

function Heading16pxWithLink({ text }: Props) {
  return (
    <>
      <div className='text-base font-medium font-mont tracking-wide wrap max-w-max'>
        {text}
      </div>
    </>
  )
}

export default Heading16pxWithLink