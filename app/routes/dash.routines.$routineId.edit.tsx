import { parse } from 'querystring';
import { Outlet, useMatches, useParams } from '@remix-run/react';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import RoutinesForm from '~/components/forms/RoutineForm';
import { updateRoutineAndTasks } from '~/models/routines.server';

import type { RoutineAndTasks } from '~/types/routineTypes';


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const editedRoutineObject = JSON.parse(parsedBody.editedRoutineString as string);
  const { id, title, userId, todos } = editedRoutineObject
  try {
    await updateRoutineAndTasks({ id, title, userId, routineToDos: todos })
    return redirect('../..')
  } catch (error) { throw error }
}


function EditRoutinePage() {

  const params = useParams();
  const matches = useMatches();
  const routines = matches.find(match => match.id === 'routes/dash.routines')?.data
  const routine = routines?.find((routine: RoutineAndTasks) => routine.id === params.routineId)

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={30}>
        <RoutinesForm routine={routine} />
      </Modal>
    </>
  )
}

export default EditRoutinePage