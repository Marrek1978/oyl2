import { Outlet, useLoaderData } from '@remix-run/react';
import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { updateDesire } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import DesiresForm from '~/components/forms/DesiresForm';


import type { DesireWithValuesAndOutcomes, } from '~/types/desireTypes';
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';
import { useEffect, useState } from 'react';
import { getValues } from '~/models/values.server';
import type { Value } from '@prisma/client';
import type { ValueWithStringDates } from '~/types/valueTypes';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await requireUserId(request);
  try {
    const allUserValues: Value[] = await getValues(userId);
    return allUserValues
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionArgs) => {
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
    id: desireData.rowId as string,
    title: desireData.title as string,
    description: desireData.description as string,
    userId,
    valueIds,
  }

  try {
    await updateDesire(desire)
    return redirect(`..`)
  } catch (error) { throw error }
}


function EditDesireDetailsPage() {

  const allUserValues: Value[] | undefined = useGetAllValues()
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | undefined>(undefined)
  const loadedData: DesireWithValuesAndOutcomes | undefined | null = useGetSpecificDesireWithValuesAndOutcomes();

  useEffect(() => {
    if (!loadedData) return
    setDesire(loadedData)
  }, [loadedData])

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresForm
          desire={desire}
          isNew={false}
          allUserValues={allUserValues}
        //  unservedValues={}
        />
      </Modal>
    </>
  )
}

export default EditDesireDetailsPage



export const useGetAllValues = ():Value[] | undefined => {
  const [allValues, setAllValues] = useState<Value[] | undefined>()
  const loadedData: ValueWithStringDates[] = useLoaderData()

  useEffect(() => {
    if (!loadedData) return
    const valuesWithProperDates:Value[] = ArrayOfObjectsStrToDates({ items: loadedData, dateKeys: ['createdAt', 'updatedAt'] })
    setAllValues(valuesWithProperDates)
  }, [loadedData])

  return allValues
}
