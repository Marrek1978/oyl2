import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { deleteRoutine } from '~/models/routines.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useGetCurrentRoutine } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.routines.$routineId';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const taskId = parsedBody.rowId as string
  try {
    await deleteRoutine({ id: taskId })
    return 'deleted'
  } catch (error) { throw error }
}


function DeleteRoutinePage() {
  
  const params = useParams()
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const { desireId, outcomeId } = params
  const loadedRoutine = useGetCurrentRoutine()

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/routines`, message: 'Routine was deleted' })


  useEffect(() => {
    if (!loadedRoutine) return
    setId(loadedRoutine.id)
    setTitle(loadedRoutine.title)
  }, [loadedRoutine])


  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'Routine'}
          title={title}
          id={id}
        />
      </Modal>
    </>
     )
}

export default DeleteRoutinePage