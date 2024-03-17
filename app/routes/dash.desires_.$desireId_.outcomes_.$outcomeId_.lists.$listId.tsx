import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import CompletedTodosForm from '~/components/forms/CompletedTodosForm'
import { useGetListsWithTodos } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists'
import useInvalidItemIdAlertAndRedirect from '~/components/displays/modals/InvalidItemIdAlertAndRedirect'
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateCompletedTodos } from '~/models/list.server'

import type { ListAndToDos } from '~/types/listTypes'


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


function SpecificList() {

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
           <div className='max-w-xl'>  
          <CompletedTodosForm list={list} />
        </div>
      )}
    </>
  )
}

export default SpecificList



export const useGetCurrentList = (): ListAndToDos | undefined | null => {
  const loadedListsAndToDos: ListAndToDos[] | undefined = useGetListsWithTodos()
  const params = useParams()
  const [list, setList] = useState<ListAndToDos | null>()

  useEffect(() => {
    const { listId } = params
    if (!loadedListsAndToDos || loadedListsAndToDos === undefined || loadedListsAndToDos.length === 0) return
    const thisList = loadedListsAndToDos.find(list => list.id === listId)
    if (!thisList || thisList === undefined) return setList(null)
    setList(thisList)

  }, [loadedListsAndToDos, params])

  return list;
}