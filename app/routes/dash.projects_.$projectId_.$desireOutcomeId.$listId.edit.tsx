import { parse } from 'querystring';
import { Outlet, useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { updateListAndTodos } from '~/models/list.server';
import TodosListForm from '~/components/forms/TodosListForm';

import type { ListAndToDos } from '~/types/listTypes';


export const action = async ({ request }: ActionArgs) => {

  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const editedListObject = JSON.parse(parsedBody.editedListString as string);
  const { id, title, userId, todos } = editedListObject
  try {
    await updateListAndTodos({ id, title, userId, todos })
  } catch (error) { throw error }

  return redirect('../..')
}


function EditProjectOutcomeListPage() {
  const matches = useMatches();
  const params = useParams();
  const lists = matches.find(match => match.id === "routes/dash.projects_.$projectId_.$desireOutcomeId")?.data.outcomeLists
  const list = lists?.find((list: ListAndToDos) => list.id === params.listId)


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={30}>
        <TodosListForm list={list}
          isNew={false}
          isProject={true}
        />
      </Modal>
    </>
  )
}

export default EditProjectOutcomeListPage