import React from 'react'
import { useMatches, useParams } from '@remix-run/react';

import NewListForm from '~/components/form/TodosListForm';
import Modal from '~/components/modals/Modal'

import type { ListAndToDos } from '~/types/listTypes';
import type { ActionArgs } from '@remix-run/server-runtime';
import { updateListAndTodos } from '~/models/list.server';
import { parse } from 'querystring';
import { getUserId } from '~/models/session.server';

export const action = async ({ request }: ActionArgs) => {

  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const editedListObject = JSON.parse(parsedBody.editedListString as string);
  const { id, title: listTitle, userId, is_recurring, todos } = editedListObject

  try {
    await updateListAndTodos({ id, title: listTitle, userId, todos, is_recurring })
  } catch (error) { throw error }
  return null

}


function EditTodosListPage() {

  const matches = useMatches();
  const params = useParams();
  const lists = matches.find(match => match.id === 'routes/dash.todos')?.data.todoLists
  const list = lists?.find((list: ListAndToDos) => list.id === params.listId)
  console.log('list', list)


  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        <NewListForm list={list} />
      </Modal>
    </>
  )
}

export default EditTodosListPage