import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useRouteLoaderData } from '@remix-run/react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/server-runtime';

import ValueForm from '~/components/forms/ValueForm';
import { requireUserId } from '~/models/session.server';
import DndValues from '~/components/dnds/values/DndValues';
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';
import { createValue, getValues, updateValuesOrder } from '~/models/values.server';

import type { Value } from '@prisma/client';
import type { ValueWithStringDates } from '~/types/valueTypes';


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    let values: Value[] = await getValues(userId);
    return values
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const valueObj = JSON.parse(parsedBody.toServerDataString as string);
    const values = valueObj.sortableArray
    try {
      await updateValuesOrder(values)
      return 'success'
    } catch (error) { return 'failed' }
  }

  if (request.method === 'POST') {
    const userId = await requireUserId(request)
    const formData = await request.formData()
    const valueData = Object.fromEntries(formData);
    let value = {
      title: valueData.title as string,
      description: valueData.description as string,
      userId,
      sortOrder: valueData.sortOrder ? parseInt(valueData.sortOrder as string) : 0,
    }
    try {
      await createValue(value)
      return 'success'
    } catch (error) { return 'failed' }
  }
}



function ValuesPage() {

  const loadedValuesData: Value[] | null = useGetAllValues()
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    if (!loadedValuesData) return
    setValues(loadedValuesData)
  }, [loadedValuesData])

  const nextSortOrder = useGetArrayLength()

  return (
    <>
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<DndValues passedValues={values} />}
        form={
          <ValueForm isNew={true} nextSortOrder={nextSortOrder} />}
      />
    </>
  )
}

export default ValuesPage


const path = 'routes/dash.values'

export const useGetLoaderData = (): ValueWithStringDates[] => {
  const [values, setValues] = useState<ValueWithStringDates[]>([]);
  const loadedValuesArray = useRouteLoaderData(path)

  useEffect(() => {
    if (loadedValuesArray === undefined || loadedValuesArray === null) return
    const valuesArray = loadedValuesArray as ValueWithStringDates[]
    setValues(valuesArray)
  }, [loadedValuesArray])

  return values
}


export const useGetArrayLength = (): number | undefined => {
  const loadedValues: ValueWithStringDates[] = useGetLoaderData()
  const [valuesLength, setValuesLength] = useState<number>()

  useEffect(() => {
    if (!loadedValues) return setValuesLength(0)
    setValuesLength(loadedValues.length)
  }, [loadedValues])

  return valuesLength
}


export const useGetAllValues = (): Value[] => {
  const loadedValues: ValueWithStringDates[] = useGetLoaderData()
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    if (!loadedValues || loadedValues === undefined) return
    const dateKeys = ['createdAt', 'updatedAt']
    const ValuesWithProperDates: Value[] = ArrayOfObjectsStrToDates({ items: loadedValues, dateKeys }) as Value[]
    setValues(ValuesWithProperDates)
  }, [loadedValues])

  return values
}

export const useGetSpecificValue = (valueId: string): Value | undefined => {
  const values: Value[] = useGetAllValues()
  const [value, setValue] = useState<Value | undefined>()

  useEffect(() => {
    if (!values || values === undefined) return  
    const value = values.find(value => value.id === valueId) as Value
    if (value === undefined || value === null) return  
    setValue(value)
  }, [values, valueId])

  return value
}