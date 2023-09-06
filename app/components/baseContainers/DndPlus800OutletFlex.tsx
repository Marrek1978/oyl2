import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'
import { Outlet } from '@remix-run/react'

interface DndPlusOutletFlexProps {
  children: React.ReactNode
}

function DndPlus800OutletFlex({children} : DndPlusOutletFlexProps) {
  return (
    <>
    <section className='flex gap-8 flex-wrap '>
      <div className='flex-1 w-full max-w-max min-w-[400px] '>
        <BasicTextAreaBG >
        {children}
        </BasicTextAreaBG>
      </div>
      <div className='flex-1 w-full max-w-[800px] min-w-[400px]'>
        <Outlet />
      </div>
    </section >
  </>
  )
}

export default DndPlus800OutletFlex