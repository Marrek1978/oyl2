import { parse } from 'querystring'
import { Outlet } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { redirect, type ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server'
import RoutineForm from '~/components/forms/RoutineForm'
import { updateRoutineAndTasks } from '~/models/routines.server';
import { sortTasks } from '~/components/utilities/helperFunctions'
import { useGetCurrentRoutine } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.routines.$routineId'

import type { RoutineAndTasks } from '~/types/routineTypes';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const id = parsedBody.id as string;
  const title = parsedBody.title as string;
  const tasks = JSON.parse(parsedBody.tasksString as string);
  try {
    await updateRoutineAndTasks({ id, title, userId, tasks })
    return redirect('..')
  } catch (error) { throw error }
}


function EditRoutinePage() {

  const loadedRoutine = useGetCurrentRoutine()
  const [routine, setRoutine] = useState<RoutineAndTasks>()

  useEffect(() => {
    if (!loadedRoutine) return
    const tasks = loadedRoutine.tasks
    const properlySortedTasks = sortTasks(tasks);
    const newRoutine = {
      ...loadedRoutine,
      tasks: properlySortedTasks
    }
    setRoutine(newRoutine)
  }, [loadedRoutine])


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <div className={`modalFormWidth__lg flex-1 `}>
          <RoutineForm isNew={false} routine={routine} />
        </div>
      </Modal>
    </>
  )
}

export default EditRoutinePage