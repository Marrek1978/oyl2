import { useRouteLoaderData } from '@remix-run/react';
import { updateDesire } from '~/models/desires.server';
import type {ActionFunctionArgs } from '@remix-run/server-runtime';

import DesiresForm from '~/components/forms/DesiresForm'

import type { validationErrorsTypes } from '~/types/desireTypes';


export const action = async ({ request }: ActionFunctionArgs) => {

  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);

  let validationErrors: validationErrorsTypes = {};
  !desireData.title && (validationErrors.title = 'A title is required')
  !desireData.description && (validationErrors.description = 'A description is required')
  if (!desireData.title || !desireData.description) return validationErrors

  let valueIds: string[] = []
  for (let key in desireData) {
    if (key.includes('value-') && desireData[key] === 'on') {
      let valueId = key.split('-')[1]
      valueIds.push(valueId)
    }
  }

  let desire = {
    id: desireData.desireId as string,
    title: desireData.title as string,
    description: desireData.description as string,
    valueIds,
  }
  try {
    await updateDesire(desire)
  } catch (error) { throw error }
  return null
}


function DesireIndexPage() {
  const { desire } = useRouteLoaderData('routes/dash.desires.$desireId')
  return (
    <>
      <DesiresForm desire={desire} />
    </>
  )
}

export default DesireIndexPage