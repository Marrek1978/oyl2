import type { ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';
import TodosListForm from '~/components/form/TodosListForm';
import Modal from '~/components/modals/Modal';
import { createListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';


//*******************    ACTIONS     *******************//
//show success message

export const action = async ({ request }: ActionArgs) => {
  //? add a success message
  try {
    const userId = await requireUserId(request);

    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const listTitle =  parsedBody.listTitle as string;
    const todos = JSON.parse(parsedBody.todosString as string);

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