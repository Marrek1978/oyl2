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


function ListsOrderPage() {

  const [searchParams] = useSearchParams();
  const miscLists = useGetMiscLists()
  const specialLists = useGetSpecialLists()
  const [lists, setLists] = useState<Array<ListAndToDos | RoutineAndTasks>>()
  const [listType, setListType] = useState<string | null>('misc')


  //when new search param.... set list type
  useEffect(() => {
    const searchParamType = searchParams.get('type')
    if (!searchParamType) return
    if (searchParamType === 'misc') setListType('misc')
    if (searchParamType === 'special') setListType('special')
  }, [searchParams])


  //when list type changes... set lists and storage
  useEffect(() => {
    if (!listType) return
    if (listType === 'misc') setLists(miscLists as Array<ListAndToDos | RoutineAndTasks>)
    if (listType === 'special') setLists(specialLists as Array<ListAndToDos | RoutineAndTasks>)
    sessionStorage.setItem('lastListType', listType);
  }, [miscLists, specialLists, listType])


  //  no liset type?  get from storage... if list type... set lists
  useEffect(() => {
    if (!listType) setListType(sessionStorage.getItem('lastListType'))
    if (listType) setLists(listType === 'misc' ? miscLists : specialLists)
  }, [miscLists, specialLists, listType]);


  return (
    <>
      <Outlet />
      <Modal zIndex={10}>
        {lists && (
          <DndItemsForm listItems={lists} listType={listType} listOrRoutine={'List'} />
        )}
      </Modal>
    </>
  )
}

export default ListsOrderPage
