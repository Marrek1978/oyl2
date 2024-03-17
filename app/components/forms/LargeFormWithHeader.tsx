import React from 'react'
import { GetHeaderBgColor } from '~/components/baseContainers/GetHeaderBgColor';

interface FormProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

function LargeFormWithHeader({ children, title }: FormProps) {

  const backgroundColor = GetHeaderBgColor()

  return (
    <div className='
      bg-base-100 shadow-xl
      grid grid-cols-[minmax(300px,1200px)]
      grid-rows-[72px_1fr_min-content]
      cursor-defaultshadow-lg
      w-full max-w-max
      max-h-full
      overflow-auto
    '>
      <div className={`
        w-full h-full px-8 
        ${backgroundColor}
        flex items-center
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