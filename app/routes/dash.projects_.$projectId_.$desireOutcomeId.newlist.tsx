import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';


import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server';
import TodosListForm from '~/components/forms/TodosListForm'



export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  console.log('parsedBody', parsedBody)
  const listTitle = parsedBody.listTitle as string;
  const todos = JSON.parse(parsedBody.todosString as string);
  const projectId = parsedBody.projectIdNum as string
  const outcomeId = parsedBody.outcomeIdNum as string
  console.log('projectId', projectId)
  console.log('outcomeId', outcomeId)
  
  try {
    // await createListAndTodos({ title: listTitle, userId, todos })
    return 'List was created.'
  } catch (error) { throw error }
};



type Props = {}

function NewListForProjectOutcomePage({ }: Props) {
  return (
    <>
      <Modal onClose={() => { }}>
        <TodosListForm
          isNew={true}
          isProject={true} />
      </Modal>


    </>
  )
}

export default NewListForProjectOutcomePage