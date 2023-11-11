import { parse } from 'querystring';
import { useMatches, useParams } from '@remix-run/react';
import { type ActionFunctionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteRoutine } from '~/models/routines.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'

import type { RoutineAndToDos } from '~/types/routineTypes';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const routineId = parsedBody.rowId as string
  try {
    await deleteRoutine({ id: routineId })
    return redirect('../..')
  } catch (error) { throw error }
}


function DeleteProjectOutcomeRoutinePage() {
  const params = useParams();
  const matches = useMatches();
  const routineId = params.routineId as string
  const routines = matches.find(match => match.id === 'routes/dash.projects_.$projectId_.$desireOutcomeId')?.data.outcomeRoutines
  const routine = routines?.find((routine: RoutineAndToDos) => routine.id === routineId)
  const title = routine?.title

  return (
    <>
      <Modal onClose={() => { }} zIndex={40}  >
        < AreYouSureDeleteModal
          item={'routine'}
          title={title}
          id={routineId}
        />
      </Modal>
    </>

  )
}

export default DeleteProjectOutcomeRoutinePage