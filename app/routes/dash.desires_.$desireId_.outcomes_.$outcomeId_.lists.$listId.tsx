import React, { useEffect, useState } from 'react'
import TodosCompletedForm from '~/components/forms/TodosCompletedForm'
import { useGetListsWithTodos } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists'
import { ListAndToDos } from '~/types/listTypes'
import { useParams } from '@remix-run/react'

function SpecificList() {

  const params = useParams()
  const loadedListsAndToDos: ListAndToDos[] | undefined = useGetListsWithTodos()
  const [list, setList] = useState<ListAndToDos>()
  const { listId } = params

  useEffect(() => {
    if (!loadedListsAndToDos) return
    const thisList = loadedListsAndToDos.find(list => list.id === listId)

    if (!thisList || thisList === undefined) return
    setList(thisList)

  }, [loadedListsAndToDos, listId])


  return (
    <>

      {list && (

        <TodosCompletedForm list={list} />
      )}
    </>
  )
}

export default SpecificList