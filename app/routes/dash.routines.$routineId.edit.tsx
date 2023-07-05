import { Outlet, useMatches, useParams } from '@remix-run/react';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring';
import React from 'react'
import RoutinesForm from '~/components/forms/RoutinesForm';
// import TodosListForm from '~/components/forms/TodosListForm';
import Modal from '~/components/modals/Modal';
import { updateRoutineAndTodos } from '~/models/routines.server';
import type { RoutineAndToDos } from '~/types/routineTypes';


export const action = async ({ request }: ActionArgs) => {

  //update db
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const editedRoutineObject = JSON.parse(parsedBody.editedRoutineString as string);
  const { id, title, userId, todos } = editedRoutineObject
  try {
    await updateRoutineAndTodos({ id, title, userId, routineToDos: todos })
    return redirect('/dash/routines')
  } catch (error) { throw error }

}


function EditRoutinePage() {
  const matches = useMatches();
  const params = useParams();
  const routines = matches.find(match => match.id === 'routes/dash.routines')?.data.routines
  const routine = routines?.find((routine: RoutineAndToDos) => routine.id === params.routineId)


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