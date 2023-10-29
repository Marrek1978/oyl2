import { parse } from 'querystring';
import { Outlet, useMatches, useParams } from '@remix-run/react';

import Modal from '~/components/modals/Modal'
import RoutineTodosCompletedForm from '~/components/forms/CompletedTasksForm';
import { reorderCompletedTasks, updateCompletedTasks } from '~/models/routines.server';

import type { RoutineAndTasks } from '~/types/routineTypes';
import type { ActionArgs } from '@remix-run/server-runtime';


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


function ProjectOutcomeRoutineCompletedPage() {

  const matches = useMatches();
  const params = useParams();
  const routines = matches.find(match => match.id === 'routes/dash.projects_.$projectId_.$desireOutcomeId')?.data.outcomeRoutines
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

export default ProjectOutcomeRoutineCompletedPage