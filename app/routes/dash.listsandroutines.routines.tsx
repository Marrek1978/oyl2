import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams, } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { updateRoutinesOrder } from '~/models/routines.server';
import DndItemsForm from '~/components/dnds/listsOrRoutinesByTitles/DndItems';
import { useGetMiscRoutines, useGetSpecialRoutines } from './dash.listsandroutines';

import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks } from '~/types/routineTypes';


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


function RoutinesOrderPage() {

  const [searchParams] = useSearchParams();
  const miscRoutines = useGetMiscRoutines()
  const specialRoutines = useGetSpecialRoutines()
  const [routines, setRoutines] = useState<Array<ListAndToDos | RoutineAndTasks>>()
  const [routineType, setRoutineType] = useState<string | null>('misc')

 
  //when new search param.... set list type
  useEffect(() => {
    const searchParamType = searchParams.get('type')
    if (!searchParamType) return
    if (searchParamType === 'misc') setRoutineType('misc')
    if (searchParamType === 'special') setRoutineType('special')
  }, [searchParams])


  //when list type changes... set lists and storage
  useEffect(() => {
    if (!routineType) return
    if (routineType === 'misc') setRoutines(miscRoutines as Array<ListAndToDos | RoutineAndTasks>)
    if (routineType === 'special') setRoutines(specialRoutines as Array<ListAndToDos | RoutineAndTasks>)
    sessionStorage.setItem('lastListType', routineType);
  }, [miscRoutines, specialRoutines, routineType])


  //  no liset type?  get from storage... if list type... set lists
  useEffect(() => {
    if (!routineType) setRoutineType(sessionStorage.getItem('lastListType'))
    if (routineType) setRoutines(routineType === 'misc' ? miscRoutines : specialRoutines)
  }, [miscRoutines, specialRoutines, routineType]);



  return (
    <>
      <Outlet />
      <Modal zIndex={10}>
        {routines && routines.length > 0 && (
          <DndItemsForm listItems={routines} listType={routineType} listOrRoutine={'Routine'} />
        )}
      </Modal>
    </>
  )
}

export default RoutinesOrderPage
