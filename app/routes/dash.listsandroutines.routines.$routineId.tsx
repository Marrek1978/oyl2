import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import CompletedTasksForm from '~/components/forms/CompletedTasksForm';
import { ChangeListArrayDates, useGetLoaders, } from './dash.listsandroutines';
import { reorderCompletedTasks, updateCompletedTasks } from '~/models/routines.server';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'

import type { RoutineAndTasks, RoutineAndTasksWithStrDates } from '~/types/routineTypes';


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




function RoutinePage() {
  const routine = useGetCurrentRoutine()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: routine, itemType: 'Routine' })

  
  useEffect(() => {
    const miscOrSpecial: 'misc' | 'special' = routine?.isSpecialRoutine === false ? 'misc' : 'special'
    // Retrieve from session storage
    const type = sessionStorage.getItem('lastListType');
    if (!type || type !== miscOrSpecial) {
      sessionStorage.setItem('lastListType', miscOrSpecial);
    }
  }, [routine]);


  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      {routine && (
        <Modal zIndex={20}>
          <div className='max-w-xl'>
            <CompletedTasksForm routine={routine} />
          </div>
        </Modal>

      )}
    </>
  )
}

export default RoutinePage




export const useGetCurrentRoutine = (): RoutineAndTasks | undefined | null => {
  const { allUserRoutines } = useGetLoaders()
  const params = useParams()
  const [routine, setRoutine] = useState<RoutineAndTasks | null>()

  useEffect(() => {
    const { routineId } = params
    if (!allUserRoutines || allUserRoutines === undefined || allUserRoutines.length === 0) return
    const RoutineWithStrDates: RoutineAndTasksWithStrDates = allUserRoutines.find((routine: RoutineAndTasksWithStrDates) => routine.id === routineId)
    if (!RoutineWithStrDates || RoutineWithStrDates === undefined) return setRoutine(null)
    const routineWithProperDates = ChangeListArrayDates([RoutineWithStrDates])
    setRoutine(routineWithProperDates[0])
  }, [allUserRoutines, params])

  return routine;
}