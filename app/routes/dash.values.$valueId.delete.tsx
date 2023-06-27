import type { Values } from '@prisma/client';
import {redirect } from '@remix-run/server-runtime';
import { useMatches, useParams } from '@remix-run/react';

import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';
import { deleteValue } from '~/models/values.server';

import type { ActionArgs } from '@remix-run/server-runtime';

export const action = async ({request}:ActionArgs) => {
  //delete value from db
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);
  const valueId = valueData.rowId as string
  try{
    await deleteValue({valueId})
    return redirect('/dash/values')
  }catch(error){throw error}
}

function DeleteValuePage() {

  const params = useParams();
  const valueId = params.valueId as string
  const matches = useMatches();
  const values = matches.find(match => match.id === 'routes/dash.values')?.data
  const value = values?.find((value: Values) => value.id === valueId)
  const title = value?.valueTitle

  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
      < AreYouSureDeleteModal
        item={'value'}
        title={title}
        id={valueId}
      />
      </Modal>
    </>
  )
}

export default DeleteValuePage