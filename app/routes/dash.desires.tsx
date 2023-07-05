import React from 'react'
import { parse } from 'querystring';
import { Outlet } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import { getDesires, updateDesiresOrder } from '~/models/desires.server';
import DndDesires from '~/components/dnds/desires/DndDesires';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

export const loader = async ({ request }: LoaderArgs) => {
  let userId;
  userId = await requireUserId(request);
  try {
    let desires = await getDesires(userId);
    let values = await getValues(userId);
    return { desires, values }
  } catch (error) { throw error }
};

export const action = async ({ request }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const desires = JSON.parse(parsedBody.desiresString as string);

  try {
    await updateDesiresOrder(desires)
    return null
  } catch (error) { throw error }
}


function DesiresPage() {

  return (
    <>
      <section className='flex gap-8'>
        <div className=' flex-1  max-w-max'>
          <BasicTextAreaBG >
            <DndDesires />
          </BasicTextAreaBG >
        </div>
        <div className='flex-1  max-w-[800px]'>
          <Outlet />
        </div>
      </section >
    </>
  )
}

export default DesiresPage