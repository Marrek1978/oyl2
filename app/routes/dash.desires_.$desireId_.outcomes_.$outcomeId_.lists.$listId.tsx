import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'

import TodosCompletedForm from '~/components/forms/TodosCompletedForm'
import { useGetListsWithTodos } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists'

import type { ListAndToDos } from '~/types/listTypes'
import Modal from '~/components/modals/Modal'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect'


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