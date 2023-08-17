import React from 'react'
import type { LoaderArgs } from '@remix-run/server-runtime';
import { Link, Outlet, isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { requireUserId } from '~/models/session.server';
import SideNav from '~/components/nav/SideNav';
import SolidBtn from '~/components/buttons/SolidBtn';
import { ListProvider } from '~/components/list/ListContext';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  return userId;
};

function Dash() {



  return (
    <>
      <main className="
        w-full
        my-12 px-6 
        min-h-screen 
        flex gap-6
          ">
        <aside className='w-56' >
          <SideNav />
        </aside>
        <article className=" flex-1 min-h-[90vh]   ">
          <ListProvider>
            <Outlet />
          </ListProvider>
        </article >
      </main >
    </>
  )
}

export default Dash

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className='m-12'>
        <div className='max-w-56'>
          <Link to='/dash'  >
            <SolidBtn
              text='Back to Safety'
              onClickFunction={() => { }}
            />
          </Link>
        </div>
        <div className='flex justify-center'>
          <div className='text-xl font-mont my-12 font-bold'>There was a problem with that action</div>
        </div>
        <p><span className='font-bold'>Error Message:</span> {error.message}</p>
        <p>The stack trace is:</p>
        <pre><span className='font-bold'>Error Stack:</span> {error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}