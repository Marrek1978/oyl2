import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'
import { Outlet } from '@remix-run/react'

interface FlexPlusOutletProps {
  children: React.ReactNode
}

function DndPlus1200OutletFlex({children} : FlexPlusOutletProps) {
  return (
    <>
    <section className='flex gap-8 flex-wrap '>
      <div className='flex-1 max-w-max min-w-[400px]'>
        <BasicTextAreaBG >
        {children}
        </BasicTextAreaBG>
      </div>
      <div className='flex-1 max-w-[1200px]  min-w-[800px]'>
        <Outlet />
      </div>
    </section >
  </>
  )
}

export default DndPlus1200OutletFlex