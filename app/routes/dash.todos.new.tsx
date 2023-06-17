import type { ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';
import NewListForm from '~/components/form/NewListForm';
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
    console.log('formBody', formBody)
    const parsedBody = parse(formBody);
    const listTitle = typeof parsedBody.listTitle === 'string' ? parsedBody.listTitle : '';
    const isRecurring = typeof parsedBody.isRecurringString === 'string' ? JSON.parse(parsedBody.isRecurringString) : false;
    const todos = typeof parsedBody.todosString === 'string' ? JSON.parse(parsedBody.todosString) : [];

    await createListAndTodos({ title: listTitle, userId, todos, is_recurring: isRecurring })
    return null
  } catch (error) { throw error }

}

function NewTodosPage() {

  return (
    <>
      <Modal onClose={() => { }} >
        <NewListForm />
      </Modal>

    </>
  )
}

export default NewTodosPage