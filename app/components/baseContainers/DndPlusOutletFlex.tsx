import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'
import { Outlet } from '@remix-run/react'

interface DndPlusOutletFlexProps {
  children: React.ReactNode
}

function DndPlusOutletFlex({children} : DndPlusOutletFlexProps) {
  return (
    <>
    <section className='flex gap-8 '>
      <div className='flex-1 max-w-max'>
        <BasicTextAreaBG >
        {children}
        </BasicTextAreaBG>
      </div>
      <div className='flex-1 max-w-[800px]'>
        <Outlet />
      </div>
    </section >
  </>
  )
}

export default DndPlusOutletFlex