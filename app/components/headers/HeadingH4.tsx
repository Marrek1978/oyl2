import React from 'react'

type Props = {
  text:string;
}

function HeadingH4({text}: Props) {
  return (
    <>
    <div className='text-lg font-medium font-mont tracking-wide wrap max-w-max'>
      {text}
    </div>
  </>
  )
}

export default HeadingH4