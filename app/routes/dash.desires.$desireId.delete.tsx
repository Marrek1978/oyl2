import React from 'react'
import { redirect } from '@remix-run/server-runtime';
import { useMatches, useParams } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/server-runtime';

import { deleteDesire } from '~/models/desires.server';
import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'

import type { DesireWithValues } from '~/types/desireTypes';

export const action = async ({ request }: ActionArgs) => {

  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const desireId = desireData.rowId as string
  try {
    await deleteDesire({ desireId })
    return redirect('/dash/desires')
  } catch (error) { throw error }
}


function DeleteDesirePage() {

  const params = useParams();
  const desireId = params.desireId as string
  const matches = useMatches();
  const desires = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire = desires?.find((desire: DesireWithValues) => desire.id === desireId)
  const title = desire?.title

  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'desire'}
          title={title}
          id={desireId}
        />
      </Modal>
    </>
  )
}

export default DeleteDesirePage