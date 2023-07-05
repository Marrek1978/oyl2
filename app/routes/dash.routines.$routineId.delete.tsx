import React from 'react'
import { parse } from 'querystring';
import { useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import { deleteRoutine } from '~/models/routines.server';
import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';

import type { RoutineAndToDos } from '~/types/routineTypes';

export const action = async ({request}: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const routineId = parsedBody.rowId as string
  try {
    await deleteRoutine({ id: routineId })
    return redirect('/dash/routines')
  } catch (error) { throw error }
}


function DeleteRoutinePage() {

  const params = useParams();
  const matches = useMatches();
  const routineId = params.routineId as string
  const routines = matches.find(match => match.id === 'routes/dash.routines')?.data.routines
  const routine = routines?.find((routine: RoutineAndToDos) => routine.id === routineId)
  const title = routine?.title
  
  return (
    <>
      <Modal
        onClose={() => { }}
        zIndex={40}
      >
        < AreYouSureDeleteModal
          item={'routine'}
          title={title}
          id={routineId}
        />
      </Modal>
    </>
  )
}

export default DeleteRoutinePage