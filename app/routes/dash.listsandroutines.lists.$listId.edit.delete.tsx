import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { deleteList } from '~/models/list.server';
import { useGetCurrentList } from './dash.listsandroutines.lists.$listId';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';



export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const listId = parsedBody.rowId as string
  try {
    await deleteList({ id: listId })
    return redirect('../../..')
  } catch (error) { throw error }
}


function DeleteListPage() {
  const loadedList = useGetCurrentList()
  const [title, setTitle] = useState<string>('')
  const [id, setId] = useState<string>('')

  useEffect(() => {
    if (!loadedList) return
    setTitle(loadedList.title)
    setId(loadedList.id)
  }, [loadedList])


  return (
    <Modal
      onClose={() => { }}
      zIndex={40}
    >
      < AreYouSureDeleteModal
        item={'to-do list'}
        title={title}
        id={id}
      />
    </Modal>
  )
}


export default DeleteListPage