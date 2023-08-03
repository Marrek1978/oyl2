import React from 'react'

interface FormProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

function LargeFormWithHeader({ children, title }: FormProps) {
  return (
    <div className='
      bg-base-100 shadow-xl
      grid grid-cols-[minmax(300px,1200px)]
      grid-rows-[72px_1fr_min-content]
      cursor-defaultshadow-lg
    '>

      <div className={`
        w-full h-full px-8 bg-base-content flex items-center
        text-xl font-mont uppercase font-normal tracking-widest 
        text-primary-300
        truncate overflow-ellipsis 
      `}>
        {title}
      </div>

      {children}
    </div>
  )
}

export default LargeFormWithHeader