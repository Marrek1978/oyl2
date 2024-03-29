import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { useGetLoaders, } from './dash.listsandroutines';
import CompletedTodosForm from '~/components/forms/CompletedTodosForm'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateCompletedTodos } from '~/models/list.server'

import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes'
import { ChangeListArrayDates } from '~/components/utilities/helperFunctions';


export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.todoId as string;
    const isComplete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateCompletedTodos({ id, isComplete });
      return 'success'
    } catch (error) { return 'failed' }
  }

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const todos = JSON.parse(parsedBody.todos as string);
    try {
      await reorderCompletedToDos({ todos });
    } catch (error) { throw error }
    return null
  }

  if (request.method === 'DELETE') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    await deleteCompletedToDosFromList({ id: parsedBody.id as string })
    return 'deleted'
  }

  throw new Error('Invalid action method in Update List Page');
}

function ListPage() {
  const list = useGetCurrentList()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: list, itemType: 'To-Do List' })

  useEffect(() => {
    const miscOrSpecial: 'misc' | 'special' = list?.isSpecialList === false ? 'misc' : 'special'
    // Retrieve from session storage
    const type = sessionStorage.getItem('lastListType');
    if (!type || type !== miscOrSpecial) {
      sessionStorage.setItem('lastListType', miscOrSpecial);
    }
  }, [list]);


  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      {list && (
        <Modal zIndex={20}>
          <div className='max-w-xl'>
            <CompletedTodosForm list={list} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default ListPage


export const useGetCurrentList = (): ListAndToDos | undefined | null => {
  const params = useParams()
  const loaderData = useGetLoaders()
  const [list, setList] = useState<ListAndToDos | null>()

  useEffect(() => {
    if(loaderData === undefined) return
    const { allUserLists } = loaderData as { allUserLists: ListAndTodosWithStrDates[] }
    const { listId } = params
    if (!allUserLists || allUserLists === undefined || allUserLists.length === 0) return
    const ListWithStrDates: ListAndTodosWithStrDates | undefined = allUserLists.find((list: ListAndTodosWithStrDates) => list.id === listId)
    if (!ListWithStrDates || ListWithStrDates === undefined) return setList(null)
    const listWithProperDates = ChangeListArrayDates([ListWithStrDates])
    setList(listWithProperDates[0])
  }, [loaderData, params])

  return list;
}