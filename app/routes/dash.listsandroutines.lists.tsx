import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams, } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import { updateListsOrder } from '~/models/list.server';
import DndItemsForm from '~/components/dnds/listsOrRoutinesByTitles/DndItems';
import { useGetMiscLists, useGetSpecialLists } from './dash.listsandroutines';

import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks } from '~/types/routineTypes';


export const action = async ({ request }: ActionArgs) => {
  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const listsObj = JSON.parse(parsedBody.toServerDataString as string);
    const list = listsObj.sortableArray
    try {
      await updateListsOrder(list)
      return 'success'
    } catch (error) { return 'failed' }
  }

  return null
}


function MiscListsOrderPage() {

  const [searchParams] = useSearchParams();
  const miscLists = useGetMiscLists()
  const specialLists = useGetSpecialLists()
  const [lists, setLists] = useState<Array<ListAndToDos | RoutineAndTasks>>([])


  useEffect(() => {
    const type = searchParams.get('type')
    if(!type) return
    if (type === 'misc') setLists(miscLists as Array<ListAndToDos | RoutineAndTasks>)
    if (type === 'special') setLists(specialLists as Array<ListAndToDos | RoutineAndTasks>)
    sessionStorage.setItem('lastListType', type);
  }, [searchParams, miscLists, specialLists])


  useEffect(() => {
    let type = searchParams.get('type');
    if (!type) {
      // Retrieve from session storage
      type = sessionStorage.getItem('lastListType');
      if (type) {
        setLists(type === 'misc' ? miscLists : specialLists);
      }
    }
  },[miscLists, specialLists, searchParams]);


  return (
    <>
      <Outlet />
      <Modal zIndex={10}>
        {lists && (
          <DndItemsForm listItems={lists} />
        )}
      </Modal>
    </>
  )
}

export default MiscListsOrderPage
