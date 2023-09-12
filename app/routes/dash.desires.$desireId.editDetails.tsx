import { Outlet, useMatches, useParams } from '@remix-run/react';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import DesiresForm from '~/components/forms/DesiresForm';
import { updateDesire } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';

import type { DesireWithValues, validationErrorsTypes, } from '~/types/desireTypes';


export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request)
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
    userId,
    valueIds,
  }

  try {
    await updateDesire(desire)
    return redirect(`/dash/desires/${desireData.desireId}`)
  } catch (error) { throw error }
}

function EditDesireDetailsPage() {

  const matches = useMatches();
  const params = useParams();
  const desires = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire = desires?.find((desire: DesireWithValues) => desire.id === params.desireId)

  return (

    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresForm desire={desire} isNew={false} />
      </Modal>
    </>
  )
}

export default EditDesireDetailsPage
