import { Outlet, useMatches, useParams } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';

import Modal from '~/components/modals/Modal';
import ListCompletedTodosForm from '~/components/form/ListCompletedTodosForm';
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateToDoComplete } from '~/models/list.server';

import type { ListAndToDos } from '~/types/listTypes';

export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.todoId as string;
    const complete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateToDoComplete({ id, complete });
    } catch (error) { throw error }
    return null;
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
    return null
  }

  throw new Error('Invalid action method in Update List Page');
}


function UpdateListPage() {

  const matches = useMatches();
  const params = useParams();
  const lists = matches.find(match => match.id === 'routes/dash.todos')?.data.todoLists
  const list = lists?.find((list: ListAndToDos) => list.id === params.listId)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} >
        <ListCompletedTodosForm list={list} />
      </Modal>
    </>
  )
}

export default UpdateListPage