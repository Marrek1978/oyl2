import React from 'react'
import { Outlet, useMatches, useParams } from '@remix-run/react';

import DesiresForm from '~/components/forms/DesiresForm';
import Modal from '~/components/modals/Modal';

import type { DesireWithValues, validationErrorsTypes } from '~/types/desireTypes';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';
import { updateDesire } from '~/models/desires.server';


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

  return redirect('/dash/desires')
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
        <DesiresForm desire={desire} />
      </Modal>
    </>
  )
}

export default EditDesireDetailsPage
