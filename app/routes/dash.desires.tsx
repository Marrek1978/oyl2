import { parse } from 'querystring';
import { Outlet, useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import { getDesires, getDesiresWithValuesAndOutcomes, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { DesireWithValues, DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';
import { useEffect, useState } from 'react';
// import { transformCurrentDesireValueOutcomeDates, transformDesiresValueOutcomeDates } from '~/components/dnds/desires/DndDesires';

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

  return (
    <>
      <div className='flex-1'>
        <Outlet />
      </div>
    </>
  )
}

export default DesiresPage


export const useGetDesireWithValuesAndOutcomes = () => {
  const params = useParams();
  const path = 'routes/dash.desires'
  const navigate = useNavigate();
  const loaderData = useRouteLoaderData(path);
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

export const useGetAllDesiresWithValuesAndOutcomes = (): DesireWithValuesAndOutcomes[] | undefined => {
  const navigate = useNavigate();
  const path = 'routes/dash.desires'
  const loaderData = useRouteLoaderData(path);
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>();


  useEffect(() => {
    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes;

    if (desiresWithValuesOutcomesStrDates !== undefined) {
      const currentDesires: DesireWithValuesAndOutcomes[] = transformDesiresValueOutcomeDates(desiresWithValuesOutcomesStrDates);
      setDesires(currentDesires);
    } else {
      navigate('/dash/desires');
      return
    }
  }, [loaderData, navigate]);

  return desires;
};


export function transformDesiresValueOutcomeDates(desiresWithValuesOutcomes: DesireWithValuesAndOutcomesWithStringDates[]): DesireWithValuesAndOutcomes[] {
  const desires = desiresWithValuesOutcomes.map((desire: DesireWithValuesAndOutcomesWithStringDates) => {
    const outcomes = desire.outcomes.sort((a, b) => a.sortOrder - b.sortOrder)
    const values = desire.desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
    let outcomesWithProperDates = []
    let valuesWithProperDates = []

    if (outcomes.length > 0) {
      outcomesWithProperDates = outcomes.map((outcome: any) => ({
        ...outcome,
        createdAt: new Date(outcome.createdAt!),
        updatedAt: new Date(outcome.updatedAt!),
      }))
    }

    if (values.length > 0) {
      valuesWithProperDates = values.map((value: any) => ({
        ...value,
        createdAt: new Date(value.createdAt!),
        updatedAt: new Date(value.updatedAt!),
      }))
    }

    return ({
      ...desire,
      createdAt: new Date(desire.createdAt!),
      updatedAt: new Date(desire.updatedAt!),
      outcomes: outcomesWithProperDates,
      desireValues: valuesWithProperDates
    })
  })

  return desires
}


export function transformCurrentDesireValueOutcomeDates(desiresWithValuesOutcomes: DesireWithValuesAndOutcomesWithStringDates): DesireWithValuesAndOutcomes {
  const desire = desiresWithValuesOutcomes
  const outcomes = desire.outcomes.sort((a, b) => a.sortOrder - b.sortOrder)
  const values = desire.desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
  let outcomesWithProperDates = []
  let valuesWithProperDates = []

  if (outcomes.length > 0) {
    outcomesWithProperDates = outcomes.map((outcome: any) => ({
      ...outcome,
      createdAt: new Date(outcome.createdAt!),
      updatedAt: new Date(outcome.updatedAt!),
    }))
  }

  if (values.length > 0) {
    valuesWithProperDates = values.map((value: any) => ({
      ...value,
      createdAt: new Date(value.createdAt!),
      updatedAt: new Date(value.updatedAt!),
    }))
  }

  const transformedDesire: DesireWithValuesAndOutcomes = ({
    ...desire,
    createdAt: new Date(desire.createdAt!),
    updatedAt: new Date(desire.updatedAt!),
    outcomes: outcomesWithProperDates,
    desireValues: valuesWithProperDates
  })

  return transformedDesire
}