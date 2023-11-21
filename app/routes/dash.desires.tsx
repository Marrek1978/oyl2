import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useRouteLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';

import { getValues } from '~/models/values.server';
import { requireUserId } from '~/models/session.server';
import DesiresForm from '~/components/forms/DesiresForm';
import DndDesires from '~/components/dnds/desires/DndDesires';
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex';
import { ArrayOfObjectsStrToDates, } from '~/components/utilities/helperFunctions';
import { createDesire, getDesires, getUserDesiresWithValuesAndOutcomes, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { ValueWithStringDates } from '~/types/valueTypes';
import type { DesireWithValues, DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates, DesireWithValuesWithStringDates } from '~/types/desireTypes';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    const allUserValues: Value[] = await getValues(userId);
    const desiresWithValues: DesireWithValues[] = await getDesires(userId);
    const desiresWithValuesAndOutcomes: DesireWithValuesAndOutcomes[] = await getUserDesiresWithValuesAndOutcomes(userId)
    return { desiresWithValues, allUserValues, desiresWithValuesAndOutcomes }
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const desiresObj = JSON.parse(parsedBody.toServerDataString as string);
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
  // const desires = useGetAllDesiresWithValues()
  const desires = useGetAllDesiresWithValuesAndOutcomes()
  const nextSortOrder = useGetDesiresArrayLength()
  const allUserValues: Value[] | undefined = useGetUserAllValues()
  const { unservedValues, numTimesValueServed }: ServedAndUnservedValues = useGetServedAndUnServerdValues()


  return (
    <>
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<DndDesires passedDesires={desires} />}
        form={
          <DesiresForm
            isNew={true}
            nextSortOrder={nextSortOrder}
            allUserValues={allUserValues}
            unservedValues={unservedValues}
            numTimesValueServed={numTimesValueServed}
          />}
      />
    </>
  )
}

export default DesiresPage



//?????????????????????????????????  CUSTOM HOOKS  ?????????????
// return { desiresWithValues, allUserValues }

interface DataWithStrDates {
  allUserValues: ValueWithStringDates[];
  desiresWithValues: DesireWithValuesWithStringDates[];
  desiresWithValuesAndOutcomes: DesireWithValuesAndOutcomesWithStringDates[]
}



export const useGetLoaderData = (path: string = 'routes/dash.desires'): DataWithStrDates => {
  const loadedData = useRouteLoaderData(path)
  const [allUserValues, setAllUserValues] = useState<ValueWithStringDates[]>([])
  const [desiresWithValues, setDesiresWithValues] = useState<DesireWithValuesWithStringDates[]>([])
  const [desiresWithValuesAndOutcomes, setDesiresWithValuesAndOutcomes] = useState<DesireWithValuesAndOutcomesWithStringDates[]>([])

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as DataWithStrDates

    const allUserValuesWithStrDates = data.allUserValues as ValueWithStringDates[]
    if (allUserValuesWithStrDates) setAllUserValues(allUserValuesWithStrDates)

    const desiresWithValuesWithStrDates = data.desiresWithValues as DesireWithValuesWithStringDates[]
    if (desiresWithValuesWithStrDates) setDesiresWithValues(desiresWithValuesWithStrDates)

    const desiresWithValuesAndOutcomesWithStrDates = data.desiresWithValuesAndOutcomes as DesireWithValuesAndOutcomesWithStringDates[]
    if (desiresWithValuesAndOutcomesWithStrDates) setDesiresWithValuesAndOutcomes(desiresWithValuesAndOutcomesWithStrDates)
  }, [loadedData])

  return { allUserValues, desiresWithValues, desiresWithValuesAndOutcomes }
}



export const useGetUserAllValues = (): Value[] => {
  const [values, setValues] = useState<Value[]>([])
  const { allUserValues } = useGetLoaderData() as DataWithStrDates

  useEffect(() => {
    if (!allUserValues) return
    const valuesWithProperDates: Value[] = ArrayOfObjectsStrToDates({ items: allUserValues, dateKeys: ['createdAt', 'updatedAt'] }) as Value[]
    setValues(valuesWithProperDates)
  }, [allUserValues])

  return values
}


export const useGetDesiresArrayLength = (): number => {
  const { desiresWithValues } = useGetLoaderData()
  const [desiresLength, setDesiresLength] = useState<number>(0)

  useEffect(() => {
    if (!desiresWithValues) return setDesiresLength(0)
    setDesiresLength(desiresWithValues.length)
  }, [desiresWithValues])

  return desiresLength
}


export const useGetAllDesiresWithValuesAndOutcomes = (): DesireWithValuesAndOutcomes[] => {
  const { desiresWithValuesAndOutcomes } = useGetLoaderData()
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>([])
  useEffect(() => {
    if (!desiresWithValuesAndOutcomes) return
    const desiresWithProperDates: DesireWithValuesAndOutcomes[] = ArrayOfObjectsStrToDates({ items: desiresWithValuesAndOutcomes, dateKeys: ['createdAt', 'updatedAt'] }) as DesireWithValuesAndOutcomes[]
    setDesires(desiresWithProperDates)
  }, [desiresWithValuesAndOutcomes])

  return desires
}


export interface NumTimesValueServedType {
  [key: string]: number;
}

export interface ServedAndUnservedValues {
  unservedValues: Value[];
  numTimesValueServed: NumTimesValueServedType[];
}


export const useGetServedAndUnServerdValues = (): ServedAndUnservedValues => {
  const [unservedValues, setUnservedValues] = useState<Value[]>([])
  const [allServedUserValues, setAllServedUserValues] = useState<Value[]>([])
  const [numTimesValueServed, setNumTimesValueServed] = useState<NumTimesValueServedType[]>([])
  const allUserValues: Value[] = useGetUserAllValues()
  const allDesiresWithValues: DesireWithValues[] = useGetAllDesiresWithValuesAndOutcomes()
  useEffect(() => {
    if (!allDesiresWithValues) return
    const allServedValues: Value[] = allDesiresWithValues.reduce((acc: Value[], desire: DesireWithValues) => {
      const values: Value[] = desire.desireValues.map((dv: any) => dv.value)
      return [...acc, ...values]
    }, [])
    setAllServedUserValues(allServedValues)
    
    const numTimesValueServedArray = allServedValues?.reduce((acc: any, value: Value) => {
      const existingObj = acc.find((obj: NumTimesValueServedType) => obj.hasOwnProperty(value.title));
      if (existingObj) {
        existingObj[value.title] += 1;
      } else {
        const newObj = { [value.title]: 1 }
        acc.push(newObj)
      }
      return acc
    }, [])

    setNumTimesValueServed(numTimesValueServedArray)
  }, [allDesiresWithValues])

  useEffect(() => {
    if (!allServedUserValues) return
    const difference = getDifferenceBetweenObjArraysById(allUserValues, allServedUserValues)
    setUnservedValues(difference as Value[])
  }, [allServedUserValues, allUserValues])

  return { unservedValues, numTimesValueServed }
}


export type HasId = {
  id: string;
  [key: string]: any;
};


export const getDifferenceBetweenObjArraysById = <T extends HasId>(largerObjArr: any, smallerObjArr: any[]): T[] => {
  const smallerArrayIds = smallerObjArr?.map((obj: T) => obj.id)
  const difference: T[] = largerObjArr?.filter((obj: T) => !smallerArrayIds?.includes(obj.id));
  return difference
}

export const isObjInObjArrayById = <T extends HasId>(obj: T, objArray: T[]): boolean => {
  const objIds = objArray?.map((obj: T) => obj.id)
  const isInArray = objIds?.includes(obj.id)
  return isInArray
} 