// import { parse } from 'querystring';

// import Modal from '~/components/modals/Modal'
// import { requireUserId } from '~/models/session.server';
// import { createListAndTodos } from '~/models/list.server';
// import TodosListForm from '~/components/forms/ListForm'

// import type { ActionFunctionArgs } from '@remix-run/server-runtime';

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const userId = await requireUserId(request);
//   const formBody = await request.text();
//   const parsedBody = parse(formBody);
//   const listTitle = parsedBody.listTitle as string;
//   const todos = JSON.parse(parsedBody.todosString as string);
//   const projectId = parsedBody.projectIdNum as string
//   const outcomeId = parsedBody.outcomeIdNum as string
//   try {
//     await createListAndTodos({ title: listTitle, userId, todos , projectId, outcomeId})
//     return 'List was created.'
//   } catch (error) { throw error }
// };



// function NewListForProjectOutcomePage() {
//   return (
//     <>
//       <Modal onClose={() => { }}>
//         <TodosListForm  />
//       </Modal>


//     </>
//   )
// }

// export default NewListForProjectOutcomePage