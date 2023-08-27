import { parse } from 'querystring';
import { useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { deleteList } from '~/models/list.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';

import type { ListAndToDos } from '~/types/listTypes';


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const listId = parsedBody.rowId as string
  try {
    await deleteList({ id: listId })
    return redirect('../..')
  } catch (error) { throw error }
}


function DeleteProjectOutcomeListPage() {
  const params = useParams();
  const matches = useMatches();

  const listId = params.listId as string
  const lists = matches.find(match => match.id === "routes/dash.projects_.$projectId_.$desireOutcomeId")?.data.outcomeLists
  const list = lists?.find((list: ListAndToDos) => list.id === listId)
  const title = list?.title

  return (
    <Modal
      onClose={() => { }}
      zIndex={40}
    >
      < AreYouSureDeleteModal
        item={'to-do list'}
        title={title}
        id={listId}
      />
    </Modal>
  )
}


export default DeleteProjectOutcomeListPage