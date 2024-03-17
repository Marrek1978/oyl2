import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { useGetLoadedLists } from './dash.schedule'
import { commonActionFunctions } from './dash.today';
import { getAndSortTodosFromLists } from '~/components/displays/today/DisplayImportantLists'
import TimeCriticalCompletedTodosForm from '~/components/forms/TimeCriticalCompletedTodosForm'

import type { ToDo } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes'

export const action = async ({ request }: ActionFunctionArgs) => {
  return commonActionFunctions(request)
}


//! ********************   TimeCriticalToDosPage   ********************
//! ********************   pass list with todos, you need to pass the list id as well   ********************

function TimeCriticalToDosPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const loadedLists: ListAndToDos[] = useGetLoadedLists('routes/dash.today')

  const [list, setList] = useState<ToDo[]>([])
  const [formTitle, setFormTitle] = useState<string>('')

  useEffect(() => {
    if (type === 'urgent' || type === 'important'){
        setList(getAndSortTodosFromLists({ listsWithToDos: loadedLists, importance: type }))
        setFormTitle(type)
    }
    if (type === '<' || type === '=' || type === '>') {
      setList(getAndSortTodosFromLists({ listsWithToDos: loadedLists, operator: type }))
      if (type === '<') setFormTitle('Past Due')
      if (type === '=') setFormTitle('Due Today')
      if (type === '>') setFormTitle('Upcoming')
    }
  }, [type, loadedLists])


  return (
    <Modal zIndex={20}>
      <div className='max-w-xl'>
        <TimeCriticalCompletedTodosForm list={list} formTitle={formTitle} />
      </div>
    </Modal>
  )
}

export default TimeCriticalToDosPage