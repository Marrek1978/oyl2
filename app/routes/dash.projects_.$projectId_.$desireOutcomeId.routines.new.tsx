import type { ActionFunctionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';
import React from 'react'
import RoutinesForm from '~/components/forms/RoutineForm'
import Modal from '~/components/modals/Modal'
import { createRoutineAndTasks } from '~/models/routines.server';
import { requireUserId } from '~/models/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {

  try {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const routineTitle = parsedBody.routineTitle as string;
    const tasks = JSON.parse(parsedBody.routineToDosString as string);
    const outcomeId = parsedBody.outcomeIdNum as string;
    await createRoutineAndTasks({ userId, title: routineTitle, tasks, outcomeId })
    return ('Routine was created.')
  } catch (error) { throw error }

}


function NewRoutineForProjectOutcomePage() {
  return (
    <>
      <Modal onClose={() => { }} >
        <RoutinesForm />
      </Modal>
    </>
  )
}

export default NewRoutineForProjectOutcomePage