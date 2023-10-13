import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';
import { Outlet, useMatches, useParams } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import TodosCompletedForm from '~/components/forms/TodosCompletedForm';
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateToDoComplete } from '~/models/list.server';

import type { ListAndToDos } from '~/types/listTypes';

export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.todoId as string;
    const isComplete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateToDoComplete({ id, isComplete });
      return 'success'
    } catch (error) { return 'failed' }
  }

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const todos = JSON.parse(parsedBody.todos as string);
    try {
      await reorderCompletedToDos({ todos });
    } catch (error) { throw error }
    return null
  }

  if (request.method === 'DELETE') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    await deleteCompletedToDosFromList({ id: parsedBody.id as string })
    return 'deleted'
  }

  throw new Error('Invalid action method in Update List Page');
}


function UpdateListPage() {

  console.log('UpdateListPage')
  const matches = useMatches();
  const params = useParams();
  const lists = matches.find(match => match.id === 'routes/dash.lists')?.data
  const list = lists?.find((list: ListAndToDos) => list.id === params.listId)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} >
        <TodosCompletedForm list={list} />
      </Modal>
    </>
  )
}

export default UpdateListPage