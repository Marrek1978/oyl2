import { json } from '@remix-run/server-runtime';

import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import { transformDataDates } from '~/components/utilities/helperFunctions';

import TodoLists from '~/components/list/TodoLists';

export const loader = async ({ request }: LoaderArgs) => {

  try {
    const userId = await requireUserId(request);
    const todoLists = await getListAndTodos({ userId });
    return json({ todoLists });
  } catch (error) {
    throw error
  }
}

function ListsPage() {

  const initialTodosData = useLoaderData<typeof loader>();
  const todoLists = transformDataDates(initialTodosData.todoLists);

  return (
    <>
      <TodoLists lists={todoLists} />
    </>
  )
}

export default ListsPage