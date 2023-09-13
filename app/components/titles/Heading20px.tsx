import React from 'react'


function Heading20px({ text }: { text: string }) {
  return (
    <>
      <div className=' font-semibold font-mont tracking-wide text-xl '>
        {text}
      </div>
    </>
  )
}

export default Heading20px