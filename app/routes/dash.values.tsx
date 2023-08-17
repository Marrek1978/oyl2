import { parse } from 'querystring';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getValues, updateValuesOrder } from '~/models/values.server';
import DndValues from '~/components/dnds/values/DndValues';
import DndPlus800OutletFlex from '~/components/baseContainers/DndPlus800OutletFlex';

export const loader = async ({ request }: LoaderArgs) => {
  console.log('loader values.tsx')
  let userId = await requireUserId(request);
  console.log('userId', userId)
  try {
    let values = await getValues(userId);
    return values
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionArgs) => {
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

      <DndPlus800OutletFlex >
        <DndValues />
      </DndPlus800OutletFlex>
    </>
  )
}

export default ValuesPage