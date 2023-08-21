import { parse } from 'querystring';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import DndValues from '~/components/dnds/values/DndValues';
import { getValues, updateValuesOrder } from '~/models/values.server';
import DndPlus800OutletFlex from '~/components/baseContainers/DndPlus800OutletFlex';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await requireUserId(request);
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
    return 'Values order was updated'
  } catch (error) { 
    // throw error 
    return 'There was an issue updating the sorting order'
  }
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