import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/server-runtime';

import TodoLists from '~/components/list/TodoLists';
import { getAllListsAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import { transformToDoDataDates } from '~/components/utilities/helperFunctions';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  try {
    const todoLists = await getAllListsAndTodos(userId);
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