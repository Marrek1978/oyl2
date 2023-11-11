import { Outlet } from '@remix-run/react'
import type { LoaderFunctionArgs } from "@remix-run/node";
// import { LinksFunction } from '@remix-run/node';
// import React from 'react'
import { requireUserId } from '~/models/session.server';
// import { ClientOnly } from 'remix-utils';
// import MySideNav from '~/components/MySideNav.client';
import SideNav from '~/components/nav/SideNav';

import { ListProvider } from '~/components/list/ListContext';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('in dashboard loader')
  
  const userId = await requireUserId(request);
  console.log( 'userId is ', userId)
  return null;

  // load todos from the database

};

function Dashboard() {

  // main desires to focus / meditate on
  // or progress on each?
  // streaks
  // money buckets
  // ideal to manifest - grand vision --  or  --- work on 

  //prioritize what to work on today
  //  

  // todos
  //* lists
  //  sort todos for due today
  //  sort todos for urgent 
  //  sort todos for important
  //  sort todos for due date

  //* projects
  //  sort todos for projects

  //* priority

  //*special lists
  //  sort todos for appointments
  //  sort todos for shopping - groceries, home stuff, 




  //


  return (
    <>
      <main className="relative min-h-screen sm:flex gap-6 mt-12 px-6">
        <aside className='mt-0' >
          <div className='mt-1'>
            <SideNav />
          </div>
        </aside>
        <div className="relative min-h-[90vh] w-full">
          <ListProvider>
            <Outlet />
          </ListProvider>
        </div >
      </main >
    </>
  )
}

export default Dashboard