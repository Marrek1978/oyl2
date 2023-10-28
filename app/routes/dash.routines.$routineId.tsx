import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';
import { Outlet, useMatches, useParams } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import RoutineTodosCompletedForm from '~/components/forms/RoutineTodosCompletedForm';
import { reorderCompletedTasks, updateCompletedTasks } from '~/models/routines.server';

import type { RoutineAndTasks } from '~/types/routineTypes';

export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.routineToDoId as string;
    const complete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateCompletedTasks({ id, complete });
      return 'success'
    } catch (error) { throw error }
  }

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const tasks = JSON.parse(parsedBody.routineToDos as string);
    try {
      await reorderCompletedTasks({ tasks });
    } catch (error) { throw error }
    return null
  }
}


function UpdateRoutinesCompletedPage() {

  const matches = useMatches();
  const params = useParams();
  const routines = matches.find(match => match.id === 'routes/dash.routines')?.data
  const routine = routines?.find((routine: RoutineAndTasks) => routine.id === params.routineId)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} >
        <RoutineTodosCompletedForm routine={routine} />
      </Modal>
    </>
  )
}

export default UpdateRoutinesCompletedPage