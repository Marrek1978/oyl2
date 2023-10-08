import { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteDesire } from '~/models/desires.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { useGetSpecificDesireWithValuesAndOutcomes } from './dash.desires_.$desireId';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const desireId = desireData.rowId as string
  try {
    await deleteDesire({ desireId })
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteDesirePage() {
  const params = useParams();
  const [title, setTitle] = useState<string>('')

  const desireId = params.desireId as string
  const desire: DesireWithValuesAndOutcomes | undefined = useGetSpecificDesireWithValuesAndOutcomes();

  useEffect(() => {
    if (!desire) return
    setTitle(desire.title)
  }, [desire])

  useFormDeletedToastAndRedirect({ redirectTo:'/dash/desires' , message:'Desire was deleted'})

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