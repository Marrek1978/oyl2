import React from 'react'
import BasicTextAreaBG from './BasicTextAreaBG'
import { Outlet } from '@remix-run/react'

interface FlexPlusOutletProps {
  children: React.ReactNode
}

function DndPlus1200OutletFlex({children} : FlexPlusOutletProps) {
  return (
    <>
    <section className='flex gap-8 '>
      <div className='flex-1 max-w-max'>
        <BasicTextAreaBG >
        {children}
        </BasicTextAreaBG>
      </div>
      <div className='flex-1 max-w-[1200px]'>
        <Outlet />
      </div>
    </section >
  </>
  )
}

export default DndPlus1200OutletFlex