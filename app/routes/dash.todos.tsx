import { json } from '@remix-run/server-runtime';
import type { LoaderArgs } from '@remix-run/server-runtime';
import { Outlet, useLoaderData } from '@remix-run/react';

import { getListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import TodoLists from '~/components/list/TodoLists';
import { transformDataDates } from '~/components/utilities/helperFunctions';

export const loader = async ({ request }: LoaderArgs) => {

  try {
    const userId = await requireUserId(request);
    const todoLists = await getListAndTodos({ userId });
    return json({ todoLists });
  } catch (error) {
    throw error
  }
}

function TodosPage() {

  const initialData = useLoaderData<typeof loader>();
  const allLists = transformDataDates(initialData.todoLists);

  return (
    <>
      <Outlet />
      <TodoLists lists={allLists} />
    </>
  )
}

export default TodosPage