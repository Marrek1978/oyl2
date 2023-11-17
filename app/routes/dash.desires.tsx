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
import { createDesire, getDesires, updateDesiresOrder } from '~/models/desires.server';

import type { Value } from '@prisma/client';
import type { ValueWithStringDates } from '~/types/valueTypes';
import type { DesireWithValues, DesireWithValuesWithStringDates } from '~/types/desireTypes';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    const allUserValues: Value[] = await getValues(userId);
    const desiresWithValues: DesireWithValues[] = await getDesires(userId);
    return { desiresWithValues, allUserValues }
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
  const desires = useGetAllDesiresWithValues()
  const nextSortOrder = useGetDesiresArrayLength()
  const allUserValues: Value[] | undefined = useGetUserAllValues()
  const unservedValues: Value[] | undefined = useGetAllUnServerdValues()


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
}



export const useGetLoaderData = (path: string = 'routes/dash.desires'): DataWithStrDates => {
  const loadedData = useRouteLoaderData(path)
  const [allUserValues, setAllUserValues] = useState<ValueWithStringDates[]>([])
  const [desiresWithValues, setDesiresWithValues] = useState<DesireWithValuesWithStringDates[]>([])

  useEffect(() => {
    if (!loadedData || loadedData === undefined) return
    const data = loadedData as DataWithStrDates

    const allUserValuesWithStrDates = data.allUserValues as ValueWithStringDates[]
    if (allUserValuesWithStrDates) setAllUserValues(allUserValuesWithStrDates)

    const desiresWithValuesWithStrDates = data.desiresWithValues as DesireWithValuesWithStringDates[]
    if (desiresWithValuesWithStrDates) setDesiresWithValues(desiresWithValuesWithStrDates)
  }, [loadedData])

  return { allUserValues, desiresWithValues }
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


export const useGetAllDesiresWithValues = (): DesireWithValues[] => {
  const { desiresWithValues } = useGetLoaderData()
  const [desires, setDesires] = useState<DesireWithValues[]>([])
  useEffect(() => {
    if (!desiresWithValues) return
    const desiresWithProperDates: DesireWithValues[] = ArrayOfObjectsStrToDates({ items: desiresWithValues, dateKeys: ['createdAt', 'updatedAt'] }) as DesireWithValues[]
    setDesires(desiresWithProperDates)
  }, [desiresWithValues])

  return desires
}



export const useGetAllUnServerdValues = (): Value[] => {
  const [unservedValues, setUnservedValues] = useState<Value[]>([])
  const [allServedUserValues, setAllServedUserValues] = useState<Value[]>([])
  const allUserValues: Value[] = useGetUserAllValues()
  const allDesiresWithValues: DesireWithValues[] = useGetAllDesiresWithValues()

  useEffect(() => {
    if (!allDesiresWithValues) return
    const allServedValues: Value[] = allDesiresWithValues.reduce((acc: Value[], desire: DesireWithValues) => {
      const values: Value[] = desire.desireValues.map((dv: any) => dv.value)
      return [...acc, ...values]
    }, [])
    setAllServedUserValues(allServedValues)
  }, [allDesiresWithValues])

  useEffect(() => {
    if (!allServedUserValues) return
    const difference = getDifferenceBetweenObjArraysById(allUserValues, allServedUserValues)
    setUnservedValues(difference as Value[])
  }, [allServedUserValues, allUserValues])

  return unservedValues
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