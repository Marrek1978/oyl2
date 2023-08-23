import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { createListAndTodos } from '~/models/list.server';
import Modal from '~/components/modals/Modal';
import TodosListForm from '~/components/forms/TodosListForm';

export const action = async ({ request }: ActionArgs) => {

  //?  handle diff between random and project
  //ehck for hidden input project Id... switch db call
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const listTitle = parsedBody.listTitle as string;
  const todos = JSON.parse(parsedBody.todosString as string);
  
  try {
    await createListAndTodos({ title: listTitle, userId, todos })
    return null
  } catch (error) { throw error }
}

function NewTodosPage() {

  return (
    <>
      <Modal onClose={() => { }} >
        <TodosListForm />
      </Modal>
    </>
  )
}

export default NewTodosPage