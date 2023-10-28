import { parse } from 'querystring';
import { Outlet, useMatches, useParams } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import RoutinesForm from '~/components/forms/RoutineForm';
import type { RoutineAndTasks } from '~/types/routineTypes';
import { updateRoutineAndTasks } from '~/models/routines.server';

import {type ActionArgs, redirect } from '@remix-run/server-runtime';

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



function EditProjectOutcomeRoutinePage() {

  const params = useParams();
  const matches = useMatches();
  const routines = matches.find(match => match.id === "routes/dash.projects_.$projectId_.$desireOutcomeId")?.data.outcomeRoutines
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

export default EditProjectOutcomeRoutinePage