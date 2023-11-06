import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { ChangeListArrayDates, useGetLoaders, } from './dash.listsandroutines';
import CompletedTodosForm from '~/components/forms/CompletedTodosForm'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateCompletedTodos } from '~/models/list.server'

import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes'


export const action = async ({ request }: ActionArgs) => {

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




function MiscListPage() {
  const list = useGetCurrentList()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: list, itemType: 'To-Do List' })

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

export default MiscListPage




export const useGetCurrentList = (): ListAndToDos | undefined | null => {
  const { allUserLists } = useGetLoaders()
  const params = useParams()
  const [list, setList] = useState<ListAndToDos | null>()

  useEffect(() => {
    const { listId } = params
    if (!allUserLists || allUserLists === undefined || allUserLists.length === 0) return
    const ListWithStrDates: ListAndTodosWithStrDates = allUserLists.find((list: ListAndTodosWithStrDates) => list.id === listId)
    if (!ListWithStrDates || ListWithStrDates === undefined) return setList(null)
    const listWithProperDates = ChangeListArrayDates([ListWithStrDates])
    setList(listWithProperDates[0])
  }, [allUserLists, params])

  return list;
}