import { Outlet } from '@remix-run/react'
import React from 'react'

function DashboardFocusRoute() {
  return (
    <div className=' border-2 border-blue-500 w-full'>
      Dashboard Focus
      <header className='text-3xl text-lightText font-nanum font-medium border border-red-500'>Dashboard Focus Header - main meditation, $/$$$, and Streaks</header>
      <div className='border border-green-500'>
        Dashboard Focus content
        <div>
          <Outlet />
        </div>
      
      </div>
    </div>
  )
}

export default DashboardFocusRoute