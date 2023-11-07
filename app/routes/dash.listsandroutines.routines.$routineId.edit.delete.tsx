import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';
import { deleteRoutine } from '~/models/routines.server';
import { useGetCurrentRoutine } from './dash.listsandroutines.routines.$routineId';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const taskId = parsedBody.rowId as string
  try {
    await deleteRoutine({ id: taskId })
    return 'deleted'
  } catch (error) { throw error }
}



function DeleteRoutinePage() {

  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const loadedRoutine = useGetCurrentRoutine()

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/listsandroutines/routines`, message: 'Routine was deleted' })


  useEffect(() => {
    if (!loadedRoutine) return
    setId(loadedRoutine.id)
    setTitle(loadedRoutine.title)
  }, [loadedRoutine])


  return (
    <>
      <Modal onClose={() => { }} zIndex={40}>
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