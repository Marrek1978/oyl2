import React from 'react'

interface BasicClearBGProps {
  children: React.ReactNode
}

function BasicClearBG({children}: BasicClearBGProps) {
  return (
    <div className='px-8'>
      {children}
    </div>
  )
}

export default BasicClearBG
