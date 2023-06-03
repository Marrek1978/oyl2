import { Outlet } from '@remix-run/react'
import type { LoaderArgs } from "@remix-run/node";
// import { LinksFunction } from '@remix-run/node';
// import React from 'react'
import { requireUserId } from '~/session.server';
// import { ClientOnly } from 'remix-utils';
// import MySideNav from '~/components/MySideNav.client';
import SideNav from '~/components/nav/SideNav';

import { ListProvider } from '~/components/list/ListContext';


export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return null;

};

function Dashboard() {
  return (
    <>
      <ListProvider>
        <main className="relative min-h-screen sm:flex gap-6 mt-12 px-6">
          <aside className='mt-0' >
            <div className='mt-1'>
              <SideNav />
            </div>
          </aside>
          <div className="relative min-h-[90vh] w-full">
            <Outlet />
          </div >
        </main >
      </ListProvider>
    </>
  )
}

export default Dashboard