import React from 'react'

function Heading14px({ text }: { text: string }) {
  return (
    <>
      <div className=' font-semibold font-mont tracking-wide text-sm truncate overflow-ellipsis capitalize'>
        {text}
      </div>
    </>
  )
}

export default Heading14px