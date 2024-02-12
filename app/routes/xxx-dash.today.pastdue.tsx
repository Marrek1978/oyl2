import { useEffect, useState } from 'react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { useGetLoadedLists } from './dash.schedule'
import { commonActionFunctions } from './dash.today';
import { getAndSortTodosFromLists } from '~/components/today/DisplayImportantLists'
import TimeCriticalCompletedTodosForm from '~/components/forms/TimeCriticalCompletedTodosForm'

import type { ToDo } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes'

export const action = async ({ request }:ActionFunctionArgs) => {
  return commonActionFunctions(request)
}


function PastDuePage() {
  const [pastDueList, setPastDueList] = useState<ToDo[]>([])
  const loadedLists: ListAndToDos[] = useGetLoadedLists('routes/dash.today')

  useEffect(() => {
    setPastDueList(getAndSortTodosFromLists({ listsWithToDos: loadedLists, operator: '<' }))
  }, [loadedLists])


  return (
    <Modal zIndex={20}>
      <div className='max-w-xl'>
        <TimeCriticalCompletedTodosForm list={pastDueList} />
      </div>
    </Modal>
  )
}

export default PastDuePage