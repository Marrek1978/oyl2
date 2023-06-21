import { Outlet } from '@remix-run/react'
import React from 'react'

function ValuesPage() {
  return (
    <>
      <div className='text-4xl font-medium font-nanum tracking-wide'>ValuesPage</div>
      <div className='flex border-2'>
        <div>List of Values - dnd to order by title

          <div>Each values has some text with it - view on hover?  make own page for each to edit?</div>
        </div>
        <div><div> ADD, Edit, Delete</div>
          Form to add more values? or sepearate page.  Could be add Form or Edit form on click value?</div>
      </div>
      <Outlet />
    </>
  )
}

export default ValuesPage