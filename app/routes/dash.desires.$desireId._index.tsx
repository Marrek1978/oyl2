import { useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/models/session.server';
import { getDesireById, updateDesire } from '~/models/desires.server';
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';

import DesiresForm from '~/components/forms/DesiresForm'

import type { DesireWithValues, validationErrorsTypes } from '~/types/desireTypes';

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const desireId = params.desireId!
  const desire: DesireWithValues | null = await getDesireById(desireId, userId)
  if (desire === null) {
    throw { error: 'Desire not found' };
  }
  return { desire };

}

export const action = async ({ request }: ActionArgs) => {

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

  await updateDesire(desire)

  return null
}


function DesireIndexPage() {

  const { desire } = useLoaderData()
  console.log(desire)

  return (
    <>
      <DesiresForm desire={desire} />
    </>
  )
}

export default DesireIndexPage