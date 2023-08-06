import React from 'react'

interface BasicFormAreaBGProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

function BasicFormAreaBG({ children, title }: BasicFormAreaBGProps) {
  return (
    <div className='
      bg-base-100 shadow-xl
      grid grid-cols-[minmax(300px,800px)]
      grid-rows-[72px_1fr_min-content]
      cursor-defaultshadow-lg
      w-full
    '>

      <div className={`
        w-full h-full px-8 bg-base-content flex items-center
        text-xl font-mont uppercase font-normal tracking-widest 
        text-primary-300
        truncate wrap
      `}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default BasicFormAreaBG