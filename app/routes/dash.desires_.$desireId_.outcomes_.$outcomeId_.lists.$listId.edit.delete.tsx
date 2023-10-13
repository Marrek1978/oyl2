import { useEffect, useState } from 'react';
import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

import type { ActionArgs } from '@remix-run/server-runtime';
import { deleteList } from '~/models/list.server';
import { useGetCurrentList } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId';
import { parse } from 'querystring';
import { useParams } from '@remix-run/react';
import DeleteList from '~/components/list/DeleteList';


export const action = async ({ request }: ActionArgs) => {
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
  const { desireId, outcomeId } = params
  // const loadedList = useGetCurrentList()
  // const [id, setId] = useState<string>('')
  // const [title, setTitle] = useState<string>('')


  // useEffect(() => {
  //   if (!loadedList) return
  //   setId(loadedList.id)
  //   setTitle(loadedList.title)
  // }, [loadedList])

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/lists`, message: 'List was deleted' })


  return (
    <>
      {/* <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'To-Do List'}
          title={title}
          id={id}
        />
      </Modal> */}
      <DeleteList />

    </>
  )
}

export default DeleteListPage