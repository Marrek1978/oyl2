import { parse } from 'querystring';
import { Outlet, useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import { getDesires, getDesiresWithValuesAndOutcomes, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { DesireWithValues, DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';
import { useEffect, useState } from 'react';
import { transformCurrentDesireValueOutcomeDates } from '~/components/dnds/desires/DndDesires';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await requireUserId(request);
  try {
    const allUserValues: Value[] = await getValues(userId);
    const desiresWithValues: DesireWithValues[] = await getDesires(userId);
    const desiresWithValuesOutcomes = await getDesiresWithValuesAndOutcomes(userId);
    return { desiresWithValues, allUserValues, desiresWithValuesOutcomes }
  } catch (error) { throw error }
};

export const action = async ({ request }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const desires = JSON.parse(parsedBody.desiresString as string);

  try {
    await updateDesiresOrder(desires)
    return 'Desires order was updated'
  } catch (error) {
    return 'There was an issue updating the sorting order'
  }
}


function DesiresPage() {
  // const {loaderData} = useLoaderData()
  // console.log('dash.desires adn loader data is ', loaderData)

  return (
    <>
      <div className='flex-1'>
        <Outlet />
      </div>
    </>
  )
}

export default DesiresPage


type UseDesireWithValuesAndOutcomesProps = {
  route: string;
};

export const useDesireWithValuesAndOutcomes = ({ route }: UseDesireWithValuesAndOutcomesProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData(route);
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>();

  useEffect(() => {
    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes;
    const currentDesireWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates | undefined = desiresWithValuesOutcomesStrDates.find((desire: DesireWithValuesAndOutcomesWithStringDates) => desire.id === params.desireId);

    if (currentDesireWithValuesOutcomesStrDates !== undefined) {
      const currentDesire: DesireWithValuesAndOutcomes = transformCurrentDesireValueOutcomeDates(currentDesireWithValuesOutcomesStrDates);
      setDesire(currentDesire);
    } else {
      navigate('/dash/desires');
      return
    }
  }, [loaderData, params.desireId, navigate]);

  return desire;
};