import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/server-runtime';
import { Outlet, useParams, useRouteLoaderData } from '@remix-run/react'

import { requireUserId } from '~/models/session.server';
import DndRoutines from '~/components/dnds/routines/DndRoutines';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import { getRoutinesByOutcomeId, updateRoutinesOrder } from '~/models/routines.server';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';

import type {  Routine } from '@prisma/client';
import type { RoutineAndTasks, RoutineAndTasksWithStrDates } from '~/types/routineTypes';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const { outcomeId } = params
  if (!outcomeId) throw new Error('No outcomeId in URL')

  try {
    const loaderRoutines = await getRoutinesByOutcomeId(userId, outcomeId)
    return loaderRoutines
  } catch (error) { return error }
}


export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const routinesObj = JSON.parse(parsedBody.toServerDataString as string);
    const routine = routinesObj.sortableArray
    try {
      await updateRoutinesOrder(routine)
      return 'success'
    } catch (error) { return 'failed' }
  }
  return null
}



function OutcomeListsPage() {
  const routines: RoutineAndTasks[] = useGetRoutinesWithTasks()

  const params = useParams()
  const [breadcumbTitle3, setBreadcumbTitle3] = useState<string>()

  useEffect(() => {
    if (params.routineId) {
      setBreadcumbTitle3('Routine')
    }
    else {
      setBreadcumbTitle3(undefined)
    }
  }, [params])


  return (
    <>
      <BreadCrumbs
        secondCrumb={'Desire'}
        title2={'Outcome'}
        title3={breadcumbTitle3}
      />
      <DndAndFormFlex
        dnd={<DndRoutines passedRoutines={routines} />}
        form={<Outlet />}
        formMaxWidthTW='max-w-7xl'
        listMaxWidthTW='max-w-lg'
      />
    </>
  )
}

export default OutcomeListsPage



export const useGetLoaderData = ({ path = `routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.routines` }): RoutineAndTasksWithStrDates[] => {
  const [loadedRoutines, setLoadedRoutines] = useState<RoutineAndTasksWithStrDates[]>([])
  const loadedData: RoutineAndTasksWithStrDates[] | undefined = useRouteLoaderData(path)

  useEffect(() => {
    if (!loadedData) return
    setLoadedRoutines(loadedData)
  }, [loadedData])

  return loadedRoutines
}


export const useGetRoutinesWithTasks = (): RoutineAndTasks[] => {
  const [routines, setRoutines] = useState<RoutineAndTasks[]>([])
  const loadedRoutines: RoutineAndTasksWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (loadedRoutines === undefined) return
    const routinesWithProperDates: RoutineAndTasks[] = loadedRoutines.map((routine: RoutineAndTasksWithStrDates) => {
      const routineWithProperDates = ObjectStrToDates({ item: routine, dateKeys: ['createdAt', 'updatedAt'] })
      const todosWithProperDates = ArrayOfObjectsStrToDates({ items: routine.tasks, dateKeys: ['createdAt', 'updatedAt'] })
      return {
        ...routineWithProperDates,
        todos: todosWithProperDates
      }
    })
    setRoutines(routinesWithProperDates)
  }, [loadedRoutines])

  return routines
}


export const useGetRoutinesOnly = (): Routine[] => {
  const [routines, setRoutines] = useState<Routine[]>([])
  const loadedRoutines: RoutineAndTasksWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (!loadedRoutines) return
    const routinesOnly = loadedRoutines.map((routine: RoutineAndTasksWithStrDates) => {
      const { tasks, ...routinesOnly } = routine
      return routinesOnly
    })
    const routineWithProperDates = ArrayOfObjectsStrToDates({ items: routinesOnly, dateKeys: ['createdAt', 'updatedAt'] })
    setRoutines(routineWithProperDates)
  }, [loadedRoutines])

  return routines
}

export const useGetRoutinesArrayLength = (): number => {
  const [routinesLength, setRoutinesLength] = useState<number>()
  const loadedRoutines: RoutineAndTasksWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (!loadedRoutines) return setRoutinesLength(0)
    setRoutinesLength(loadedRoutines.length)
  }, [loadedRoutines])

  return routinesLength || 0
}