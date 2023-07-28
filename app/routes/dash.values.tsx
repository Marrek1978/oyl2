import { parse } from 'querystring';
import { Outlet } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getValues, updateValuesOrder } from '~/models/values.server';
import DndValues from '~/components/dnds/values/DndValues';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

export const loader = async ({ request }: LoaderArgs) => {
  let userId;
  userId = await requireUserId(request);
  try {
    let values = await getValues(userId);
    return values
  } catch (error) { throw error }
};

export const action = async ({ request }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const values = JSON.parse(parsedBody.valuesString as string);

  try {
    await updateValuesOrder(values)
    return null
  } catch (error) { throw error }
}

function ValuesPage() {

  return (
    <>
      <section className='flex gap-8 '>
        <div className='flex-1 max-w-[500px]'>
          <BasicTextAreaBG >
            <DndValues />
          </BasicTextAreaBG>
        </div>
        <div className='flex-1 max-w-[800px]'>
          <Outlet />
        </div>
      </section >
    </>
  )
}

export default ValuesPage