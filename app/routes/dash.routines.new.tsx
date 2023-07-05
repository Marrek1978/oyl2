import React from 'react'
import {type ActionArgs } from '@remix-run/server-runtime'
import RoutinesForm from '~/components/forms/RoutinesForm'

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server'
import { parse } from 'querystring'
import { createRoutineAndToDos } from '~/models/routines.server'

export const action = async ({request}:ActionArgs) => {

  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const routineTitle = parsedBody.routineTitle as string;
  const routineToDos = JSON.parse(parsedBody.routineToDosString as string);

  try {
    await createRoutineAndToDos({userId, title: routineTitle, routineToDos })
    return null
  }catch (error) {throw error}

}

function NewRoutinePage() {
  return (
    <>
      <Modal onClose={() => { }} >
        <RoutinesForm />
      </Modal>
    </>
  )
}

export default NewRoutinePage
