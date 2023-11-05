import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useFetcher } from '@remix-run/react';
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal';
import DndInfo from '~/components/dnds/DndInfo';
import { requireUserId } from '~/models/session.server';
import FormButtons from '~/components/forms/FormButtons';
import { useGetMiscLists } from './dash.listsandroutines';
import { getAllRoutines } from '~/models/routines.server';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useFetcherState from '~/components/utilities/useFetcherState';
import DndSortableList from '~/components/dnds/lists/DndSortableList';
import useServerMessages from '~/components/modals/useServerMessages';
import { getAllListsAndTodos, updateListsOrder } from '~/models/list.server';
import DndAndSortableContexts from '~/components/dnds/DndAndSortableContexts';
import useDndDropOrderSaveFunctions from '~/components/dnds/useDndDropOrderSaveFunctions';

import type { ListAndToDos, } from '~/types/listTypes';



export const loader = async ({ request }: LoaderArgs) => {
  try {
    const userId = await requireUserId(request);
    const allUserLists = await getAllListsAndTodos(userId)
    const allUserRoutines = await getAllRoutines(userId);
    return { allUserLists, allUserRoutines };
  } catch (error) {
    throw error
  }
}

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
  const fetcher = useFetcher();
  const [lists, setLists] = useState<ListAndToDos[]>([]);
  
  const miscLists = useGetMiscLists();
  const { fetcherState, fetcherMessage, } = useFetcherState({ fetcher })
  useServerMessages({ fetcherMessage, fetcherState, isShowFailed: true })
  const { handleDragEnd, setItemsArrayInProperOrder } = useDndDropOrderSaveFunctions({ fetcher, sortableArray: lists, setSortableArray: setLists })

  //initial load  
  useEffect(() => {
    if (!miscLists) return
    setItemsArrayInProperOrder(miscLists)
  }, [miscLists, setItemsArrayInProperOrder])


  return (
    <>
      <Outlet />
      <Modal >
        <BasicFormAreaBG h2Text='Re-Order Misc. Lists'>
          <div className="form-control gap-y-6 p-8">
            <DndInfo />
            <DndAndSortableContexts
              handleDragEnd={handleDragEnd}
              sortableArray={lists}
              isVertical={true}
            >
              <div>
                {lists?.map((list) => {
                  const title = (<> <span className="text-sm">{list.sortOrder + 1}</span>. {list.title}</>)
                  return (
                    <DndSortableList
                      key={list.id}
                      id={list.id}
                      title={title}
                    />
                  )
                })}
              </div>
            </DndAndSortableContexts>

            <FormButtons
              isShowSaveBtn={false}
            />
          </div>
        </BasicFormAreaBG>
      </Modal>
    </>
  )
}

export default MiscListsOrderPage
