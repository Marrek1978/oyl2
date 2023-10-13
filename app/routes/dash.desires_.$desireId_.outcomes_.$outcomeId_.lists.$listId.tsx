import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/server-runtime';


import TodosCompletedForm from '~/components/forms/TodosCompletedForm'
import { useGetListsWithTodos } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists'

import type { ListAndToDos } from '~/types/listTypes'
import Modal from '~/components/modals/Modal'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'
import { deleteCompletedToDosFromList, reorderCompletedToDos, updateToDoComplete } from '~/models/list.server'
import { parse } from 'querystring'




export const action = async ({ request }: ActionArgs) => {

  if (request.method === 'POST') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const id = parsedBody.todoId as string;
    const isComplete = JSON.parse(parsedBody.completeString as string);
    try {
      await updateToDoComplete({ id, isComplete });
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
      {list && (<TodosCompletedForm list={list} />)}
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