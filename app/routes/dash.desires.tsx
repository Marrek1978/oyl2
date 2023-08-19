import React from 'react'
import { parse } from 'querystring';
import { Outlet } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import { getDesires, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes';

export const loader = async ({ request }: LoaderArgs) => {
  let userId;
  userId = await requireUserId(request);
  try {
    let desires: DesireWithValues[] = await getDesires(userId);
    let allUserValues: Value[] = await getValues(userId);
    return { desires, allUserValues }
  } catch (error) { throw error }
};

export const action = async ({ request }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const desires = JSON.parse(parsedBody.desiresString as string);

  try {
    await updateDesiresOrder(desires)
    return 'Desires Order was updated'
  } catch (error) {
    return 'There was an issue updating the order'
  }
}


function DesiresPage() {
  return (
    <>
    <div className='flex-1'>
      <Outlet />
    </div>
    </>
  )
}

export default DesiresPage