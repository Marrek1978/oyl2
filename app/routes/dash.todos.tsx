import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import TodoLists from '~/components/list/TodoLists';
import { getListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import { transformToDoDataDates } from '~/components/utilities/helperFunctions';

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const todoLists = await getListAndTodos({ userId });
    return todoLists;
  } catch (error) {
    throw error
  }
}

function TodosPage() {

  const initialData = useLoaderData<typeof loader>();
  const allLists = transformToDoDataDates(initialData);

  return (
    <>
      <Outlet />
      <TodoLists lists={allLists} />
    </>
  )
}

export default TodosPage