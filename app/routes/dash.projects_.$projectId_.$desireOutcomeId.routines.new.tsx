import type { ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';
import React from 'react'
import RoutinesForm from '~/components/forms/RoutinesForm'
import Modal from '~/components/modals/Modal'
import { createRoutineAndToDos } from '~/models/routines.server';
import { requireUserId } from '~/models/session.server';

export const action = async ({ request }: ActionArgs) => {

  try {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const routineTitle = parsedBody.routineTitle as string;
    const routineToDos = JSON.parse(parsedBody.routineToDosString as string);
    const outcomeId = parsedBody.outcomeIdNum as string;
    await createRoutineAndToDos({ userId, title: routineTitle, routineToDos, outcomeId })
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