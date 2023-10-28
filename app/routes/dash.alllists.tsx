import { json } from '@remix-run/server-runtime';

import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs } from '@remix-run/server-runtime';

import { getRoutines } from '~/models/routines.server';
import { getMiscListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import TodoLists from '~/components/list/TodoLists';
import { transformRoutineDataDates, transformToDoDataDates } from '~/components/utilities/helperFunctions';
import AllRoutines from '~/components/routines/AllRoutines';


export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const todoLists = await getMiscListAndTodos(userId)
    const routines = await getRoutines( userId);
    return json({ todoLists, routines });
  } catch (error) {
    throw error
  }
}

function ListsPage() {

  const initialTodosData = useLoaderData<typeof loader>();
  const todoLists = transformToDoDataDates(initialTodosData.todoLists);
  const routines = transformRoutineDataDates(initialTodosData.routines);

  return (
    <>
      <TodoLists lists={todoLists} />
      <div className="mt-16">
        <AllRoutines routines={routines} />
      </div>
      <div>special lists - grocery,  purchases, yard work, house work</div>
      others ppl can access these lists
      <div>view project lists and routines</div>
    </>
  )
}

export default ListsPage