import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { deleteList } from '~/models/list.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useGetCurrentList } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const listId = parsedBody.rowId as string
  try {
    await deleteList({ id: listId })
    return 'deleted'
  } catch (error) { throw error }
}


function DeleteListPage() {

  const params = useParams()
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const loadedList = useGetCurrentList()
  const { desireId, outcomeId } = params

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/lists`, message: 'List was deleted' })


  useEffect(() => {
    if (!loadedList) return
    setId(loadedList.id)
    setTitle(loadedList.title)
  }, [loadedList])


  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'To-Do List'}
          title={title}
          id={id}
        />
      </Modal>
    </>
  )
}

export default DeleteListPage