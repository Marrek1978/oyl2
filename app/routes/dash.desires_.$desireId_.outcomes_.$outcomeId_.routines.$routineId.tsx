import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import CompletedTasksForm from '~/components/forms/CompletedTasksForm'
import { reorderCompletedTasks, updateCompletedTasks } from '~/models/routines.server';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { useGetRoutinesWithTasks } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.routines'

import type { RoutineAndTasks } from '~/types/routineTypes';


export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.taskId as string;
    const isComplete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateCompletedTasks({ id, isComplete });
      return 'success'
    } catch (error) { return 'failed' }
  }

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const tasks = JSON.parse(parsedBody.tasks as string);
    try {
      await reorderCompletedTasks({ tasks });
    } catch (error) { throw error }
    return null
  }
 

  throw new Error('Invalid action method in Update List Page');
}


function SpecificList() {

  const routine = useGetCurrentRoutine()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: routine, itemType: 'Routine' })

  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      {routine && (
        <div className='max-w-xl'>
          <CompletedTasksForm routine={routine} />
        </div>
      )}
    </>
  )
}

export default SpecificList



export const useGetCurrentRoutine = (): RoutineAndTasks | undefined | null => {
  const loadedRoutinesAndTasks: RoutineAndTasks[] | undefined = useGetRoutinesWithTasks()
  const params = useParams()
  const [routine, setRoutine] = useState<RoutineAndTasks | null>()

  useEffect(() => {
    const { routineId } = params
    if (!loadedRoutinesAndTasks || loadedRoutinesAndTasks === undefined || loadedRoutinesAndTasks.length === 0) return
    const thisRoutine = loadedRoutinesAndTasks.find(routine => routine.id === routineId)
    if (!thisRoutine || thisRoutine === undefined) return setRoutine(null)
    setRoutine(thisRoutine)

  }, [loadedRoutinesAndTasks, params])

  return routine;
}