import React from 'react'

type Props = {
  text:string;
}

function HeadingH5({text}: Props) {
  return (
    <>
    <div className='text-base font-medium font-mont tracking-wide wrap max-w-max'>
      {text}
    </div>
  </>
  )
}

export default HeadingH5