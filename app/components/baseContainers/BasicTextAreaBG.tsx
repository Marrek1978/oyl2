import React from 'react'

interface basicTextAreaBGProps {
  children: React.ReactNode
}

function BasicTextAreaBG({ children }: basicTextAreaBGProps) {
  return (
    <div className='bg-base-100 p-8 shadow-lg w-full'>
      {children}
    </div>
  )
}

export default BasicTextAreaBG