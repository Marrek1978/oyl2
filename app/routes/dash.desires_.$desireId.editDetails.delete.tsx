import { useEffect, useState } from 'react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { deleteDesire } from '~/models/desires.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal'
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const desireId = desireData.rowId as string
  try {
    await deleteDesire({ desireId })
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteDesirePage() {
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const desire: DesireWithValuesAndOutcomes | undefined | null = useGetSpecificDesireWithValuesAndOutcomes();

  useEffect(() => {
    if (!desire) return
    setTitle(desire.title)
    setId(desire.id)
  }, [desire])

  useFormDeletedToastAndRedirect({ redirectTo:'/dash/desires' , message:'Desire was deleted'})

  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'desire'}
          title={title}
          id={id}
        />
      </Modal>
    </>
  )
}

export default DeleteDesirePage