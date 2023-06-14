import { Outlet } from '@remix-run/react'
import React from 'react'

function DashboardFocusDailyRoute() {
  return (
    <>
      <div className='flex w-full'>

        <div className=' w-1/3 border border-green-500'>dashboard.focus.daily</div>
        <div className=' w-2/3 border border-green-300'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardFocusDailyRoute