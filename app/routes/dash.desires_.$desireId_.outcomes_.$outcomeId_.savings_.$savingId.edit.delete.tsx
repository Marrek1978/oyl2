import { useEffect, useState } from 'react';
import { useParams, } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { deleteSaving } from '~/models/saving.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal';
import { useGetLoaderData } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId.edit';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';


export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('action')
  const formData = await request.formData()
  const savingData = Object.fromEntries(formData);
  console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId.edit.delete.tsx:14 ~ action ~ savingData:", savingData)
  const id = savingData.rowId as string
  try {
    console.log('deleteing')
    await deleteSaving(id)
    console.log('deleted')
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteSavingPage() {
  const params = useParams();
  const [title, setTitle] = useState<string>('')

  const {desireId, outcomeId, savingId} = params 
  const saving = useGetLoaderData()
  useEffect(() => {
    if (!saving) return
    setTitle(saving.title)
  }, [saving])

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/savings`, message: 'Saving was deleted' })

  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        < AreYouSureDeleteModal
          item={'Saving'}
          title={title}
          id={savingId || saving.id as string}
        />
      </Modal>
    </>
  )
}

export default DeleteSavingPage