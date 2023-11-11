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

  const loadedValuesData = useGetAllValues()
  const nextSortOrder = useGetArrayLength()

  return (
    <>
      <Outlet />
      <DndAndFormFlex
        listMaxWidthTW={'max-w-max'}
        dnd={<DndValues passedValues={loadedValuesData} />}
        form={
          <ValueForm isNew={true} nextSortOrder={nextSortOrder} />}
      />
    </>
  )
}

export default ValuesPage





export const useGetLoaderData = (): ValueWithStringDates[] | undefined => {
  const [values, setValues] = useState<ValueWithStringDates[]>();
  const path = 'routes/dash.values'
  const loadedValuesArray = useRouteLoaderData(path)
  useEffect(() => {
    if (!loadedValuesArray) return
    setValues(loadedValuesArray)
  }, [loadedValuesArray])
  return values
}


export const useGetArrayLength = (): number | undefined => {
  const loadedValues: ValueWithStringDates[] | undefined = useGetLoaderData()
  const [valuesLength, setValuesLength] = useState<number>()

  useEffect(() => {
    if (!loadedValues) return setValuesLength(0)
    setValuesLength(loadedValues.length)
  }, [loadedValues])

  return valuesLength
}


export const useGetAllValues = (): Value[] | undefined => {
  const loadedValues: ValueWithStringDates[] | undefined = useGetLoaderData()
  const [values, setValues] = useState<Value[]>();

  useEffect(() => {
    if (!loadedValues) return
    const dateKeys = ['createdAt', 'updatedAt']
    const ValuesWithProperDates: Value[] = ArrayOfObjectsStrToDates({ items: loadedValues, dateKeys })
    setValues(ValuesWithProperDates)
  }, [loadedValues])

  return values
}

export const useGetSpecificValue = (valueId: string): { value: Value | undefined | null, values: Value[] | undefined } => {
  const values: Value[] | undefined = useGetAllValues()
  const [value, setValue] = useState<Value | null>()

  useEffect(() => {
    if (!values) return
    const value = values.find(value => value.id === valueId)
    if (value === undefined) return setValue(null)
    setValue(value)
  }, [values, valueId])

  return { value, values }
}