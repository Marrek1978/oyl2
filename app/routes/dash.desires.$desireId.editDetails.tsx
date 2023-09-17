import { redirect, type ActionArgs } from '@remix-run/server-runtime';
import { Outlet, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import { updateDesire } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import DesiresForm from '~/components/forms/DesiresForm';


import type { validationErrorsTypes, } from '~/types/desireTypes';
import { useGetDesireWithValuesAndOutcomes } from '~/routes/dash.desires';


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

  useRouteLoaderData('routes/dash.desires');

  const desire = useGetDesireWithValuesAndOutcomes();

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
