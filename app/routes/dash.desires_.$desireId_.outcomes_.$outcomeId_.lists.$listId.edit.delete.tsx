import { parse } from 'querystring';
import { useParams } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/server-runtime';

import { deleteList } from '~/models/list.server';
import DeleteList from '~/components/list/DeleteList';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';


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
  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/lists`, message: 'List was deleted' })

  return (
    <>
      <DeleteList />
    </>
  )
}

export default DeleteListPage