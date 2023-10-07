import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';
import { Outlet, useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import DesiresForm from '~/components/forms/DesiresForm';
import DndDesires from '~/components/dnds/desires/DndDesires';
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex';
import { ArrayOfObjectsStrToDates, } from '~/components/utilities/helperFunctions';
import { createDesire, getDesires, getDesiresWithValuesAndOutcomes, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { ValueWithStringDates } from '~/types/valueTypes';
import type { DesireWithValues, DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates, DesireWithValuesWithStringDates } from '~/types/desireTypes';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await requireUserId(request);
  try {
    const allUserValues: Value[] = await getValues(userId);
    const desiresWithValues: DesireWithValues[] = await getDesires(userId);
    const desiresWithValuesOutcomes = await getDesiresWithValuesAndOutcomes(userId);
    return { desiresWithValues, allUserValues, desiresWithValuesOutcomes }
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const desiresObj = JSON.parse(parsedBody.toServerDataString as string);
    console.log("🚀 ~ file: dash.desires.tsx:35 ~ action ~ desiresObj:", desiresObj)
    const desires = desiresObj.sortableArray
    try {
      await updateDesiresOrder(desires)
      return 'success'
    } catch (error) {
      return 'failed'
    }
  }

  if (request.method === 'POST') {
    const userId = await requireUserId(request)
    const formData = await request.formData()
    const desireData = Object.fromEntries(formData);

    let valueIds: string[] = []
    for (let key in desireData) {
      if (key.includes('value-') && desireData[key] === 'on') {
        let valueId = key.split('-')[1]
        valueIds.push(valueId)
      }
    }

    let desire = {
      title: desireData.title as string,
      description: desireData.description as string,
      userId,
      sortOrder: desireData.sortOrder ? parseInt(desireData.sortOrder as string) : 0,
      valueIds,
    }

    try {
      await createDesire(desire)
      return 'success'
    } catch (error) { return 'failed' }
  }
}


function DesiresPage() {


  const desires = useGetAllDesiresWithValues()
  const nextSortOrder = useGetDesiresArrayLength()
  const allUserValues: Value[] | undefined = useGetAllValues()

  return (
    <>
      <Outlet />
      <DndAndFormFlex
        dnd={<DndDesires passedDesires={desires} />}
        form={
          <DesiresForm isNew={true} nextSortOrder={nextSortOrder} allUserValues={allUserValues} />}
      />
    </>
  )
}

export default DesiresPage




export const useGetLoaderData = () => {
  const path = 'routes/dash.desires'
  const { desiresWithValues, allUserValues, desiresWithValuesOutcomes } = useRouteLoaderData(path)

  const [allUserValuesStrDates, setAllUserValuesStrDates] = useState<ValueWithStringDates[]>()
  const [desiresWithValuesStrDates, setDesiresWithValuesStrDates] = useState<DesireWithValuesWithStringDates[]>()
  const [desiresWithValuesOutcomesStrDates, setDesiresWithValuesOutcomesStrDates] = useState<DesireWithValuesAndOutcomesWithStringDates[]>()

  useEffect(() => {
    if (allUserValues) setAllUserValuesStrDates(allUserValues)
    if (desiresWithValues) setDesiresWithValuesStrDates(desiresWithValues)
    if (desiresWithValuesOutcomes) setDesiresWithValuesOutcomesStrDates(desiresWithValuesOutcomes)
  }, [allUserValues, desiresWithValues, desiresWithValuesOutcomes])

  return { allUserValuesStrDates, desiresWithValuesStrDates, desiresWithValuesOutcomesStrDates }
}



export const useGetAllValues = (): Value[] | undefined => {
  const [values, setValues] = useState<Value[]>()
  const { allUserValuesStrDates } = useGetLoaderData()

  useEffect(() => {
    if (!allUserValuesStrDates) return
    const valuesWithProperDates: Value[] = ArrayOfObjectsStrToDates({ items: allUserValuesStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setValues(valuesWithProperDates)
  }, [allUserValuesStrDates])

  return values
}


export const useGetDesiresArrayLength = (): number | undefined => {
  const { desiresWithValuesStrDates } = useGetLoaderData()
  const [desiresLength, setDesiresLength] = useState<number>()

  useEffect(() => {
    if (!desiresWithValuesStrDates) return setDesiresLength(0)
    setDesiresLength(desiresWithValuesStrDates.length)
  }, [desiresWithValuesStrDates])

  return desiresLength
}


export const useGetAllDesiresWithValues = (): DesireWithValues[] | undefined => {
  const { desiresWithValuesStrDates } = useGetLoaderData()
  const [desires, setDesires] = useState<DesireWithValues[]>()

  useEffect(() => {
    if (!desiresWithValuesStrDates) return
    const desiresWithProperDates: DesireWithValues[] = ArrayOfObjectsStrToDates({ items: desiresWithValuesStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setDesires(desiresWithProperDates)
  }, [desiresWithValuesStrDates])

  return desires
}








//?????????????????????????????????
//?????????????????????????????????
//?????????????????????????????????




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