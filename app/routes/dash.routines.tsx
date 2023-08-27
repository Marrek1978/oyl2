import { Outlet, useLoaderData } from '@remix-run/react';
import { type LoaderArgs } from '@remix-run/server-runtime';

import { getRoutines } from '~/models/routines.server';
import { requireUserId } from '~/models/session.server';
import AllRoutines from '~/components/routines/AllRoutines';
import { transformRoutineDataDates } from '~/components/utilities/helperFunctions';

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const routines = await getRoutines({ userId });
    return routines;
  } catch (error) {
    throw error
  }
}


function RoutinesPage() {
  const initialData = useLoaderData<typeof loader>();
  const allRoutines = transformRoutineDataDates(initialData);

  return (
    <>
      <Outlet />
      <AllRoutines routines={allRoutines} />
    </>
  )
}

export default RoutinesPage
