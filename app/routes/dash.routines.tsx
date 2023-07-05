import React from 'react'
import { Outlet, useLoaderData } from '@remix-run/react';
import { type LoaderArgs, json } from '@remix-run/server-runtime';

import { getRoutines } from '~/models/routines.server';
import { requireUserId } from '~/models/session.server';
import { transformRoutineDataDates } from '~/components/utilities/helperFunctions';
import AllRoutines from '~/components/routines/AllRoutines';

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const routines = await getRoutines({ userId });
    return json({ routines });
  } catch (error) {
    throw error
  }
}


function RoutinesPage() {
  const initialData = useLoaderData<typeof loader>();
  const allRoutines = transformRoutineDataDates(initialData.routines);
  return (
    <>
      <Outlet />
      <AllRoutines routines={allRoutines} />
    </>
  )
}

export default RoutinesPage
