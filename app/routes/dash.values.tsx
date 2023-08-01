import { parse } from 'querystring';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getValues, updateValuesOrder } from '~/models/values.server';
import DndValues from '~/components/dnds/values/DndValues';
import DndPlusOutletFlex from '~/components/baseContainers/DndPlusOutletFlex';

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

      <DndPlusOutletFlex >
        <DndValues />
      </DndPlusOutletFlex>
    </>
  )
}

export default ValuesPage