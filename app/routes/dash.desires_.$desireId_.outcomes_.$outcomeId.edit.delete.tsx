import { useEffect, useState } from 'react';
import { type ActionFunctionArgs } from '@remix-run/server-runtime';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';

import Modal from '~/components/modals/Modal'
import { deleteOutcomeById } from '~/models/outcome.server';
import { useGetOutcomeIdLoaderData } from './dash.desires_.$desireId_.outcomes_.$outcomeId';

import type { OutcomeWithAllWithStringDates } from '~/types/outcomeTypes';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useParams } from '@remix-run/react';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const outcomeData = Object.fromEntries(formData);
  const outcomeId = outcomeData.rowId as string
  try {
    await deleteOutcomeById(outcomeId)
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteOutcomePage() {

  const params = useParams()
  const { desireId } = params
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const { outcomeWithStrDates } = useGetOutcomeIdLoaderData()
  const outcomeWithAll: OutcomeWithAllWithStringDates | null | undefined = outcomeWithStrDates

  useEffect(() => {
    if (!outcomeWithAll) return
    setTitle(outcomeWithAll.title)
    setId(outcomeWithAll.id)
  }, [outcomeWithAll])

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes`, message: 'Outcome was deleted' })


  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        <AreYouSureDeleteModal
          item={'Outcome'}
          title={title}
          id={id}
        />
      </Modal>
    </>
  )
}

export default DeleteOutcomePage

