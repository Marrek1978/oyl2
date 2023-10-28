import { parse } from 'querystring';
import ListForm from '~/components/forms/ListForm'
import type { ActionArgs } from '@remix-run/server-runtime';

import { createList } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import { useGetListsArrayLength } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists';


export const action = async ({ request }: ActionArgs) => {

  console.log('lists._index.tsx action')


  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);

    const title = parsedBody.title as string;
    const sortOrder = parsedBody.sortOrder ? parseInt(parsedBody.sortOrder as string) : 0;
    let todos = [];
    if (parsedBody.todosString) {
      todos = JSON.parse(parsedBody.todosString as string);
    }
    const outcomeId = parsedBody.outcomeId as string;
    try {
      await createList({ title, userId, todos, outcomeId, sortOrder })
      return 'success'
    } catch (error) { return 'failed' }
  }
  return null
}


function ListFormIndexPage() {

  const nextSortOrder = useGetListsArrayLength()

  return (
    <ListForm nextSortOrder={nextSortOrder} />
  )
}

export default ListFormIndexPage