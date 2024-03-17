import React from 'react'

type Props = {
  text:string;
}

function HeadingH3({text}: Props) {
  return (
    <>
    <div className='text-xl font-medium font-mont tracking-wide wrap max-w-max'>
      {text}
    </div>
  </>
  )
}

export default HeadingH3