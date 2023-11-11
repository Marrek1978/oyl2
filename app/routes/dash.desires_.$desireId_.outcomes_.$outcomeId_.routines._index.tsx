import { parse } from 'querystring';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import RoutineForm from '~/components/forms/RoutineForm';
import { createRoutineAndTasks } from '~/models/routines.server';
import { useGetRoutinesArrayLength } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.routines';


export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const title = parsedBody.title as string;
    const sortOrder = parsedBody.sortOrder ? parseInt(parsedBody.sortOrder as string) : 0;
    let tasks = [];
    if (parsedBody.tasksString) {
      tasks = JSON.parse(parsedBody.tasksString as string);
    }

    const outcomeId = parsedBody.outcomeId as string;
    try {
      await createRoutineAndTasks({ title, userId, tasks, outcomeId, sortOrder })
      return 'success'
    } catch (error) { return 'failed' }
  }
  return null
}


function ListFormIndexPage() {
  const nextSortOrder = useGetRoutinesArrayLength()

  return (
    <RoutineForm nextSortOrder={nextSortOrder} />
  )
}

export default ListFormIndexPage