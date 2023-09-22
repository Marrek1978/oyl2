import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import type { ListAndToDos } from '~/types/listTypes'
import TimeCriticalTodoListCard from '../list/timeCritical/TimeCriticalTodoListCard'

import type { List, ListToDo } from '@prisma/client'

type Props = {
  loadedLists: ListAndToDos[]
}

export type ToDosWithListInfo = {
  listTitle: List['title'];
  listId: List['id'];
  projectId: List['projectId'];
  outcomeId: List['outcomeId'];
  todos: ListToDo[];
}

function DisplayImportantLists({ loadedLists }: Props) {

  const [urgentToDosWithListInfo, setUrgentToDosWithListInfo] = useState<ToDosWithListInfo[]>()
  const [pastDueToDosWithListInfo, setPastDueToDosWithListInfo] = useState<ToDosWithListInfo[]>()
  const [upcomingToDosWithListInfo, setUpcomingToDosWithListInfo] = useState<ToDosWithListInfo[]>()
  const [dueTodayToDosWithListInfo, setDueTodayToDosWithListInfo] = useState<ToDosWithListInfo[]>()
  const [importantToDosWithListInfo, setImportantToDosWithListInfo] = useState<ToDosWithListInfo[]>()

  useEffect(() => {
    if (!loadedLists) return
    setDueTodayToDosWithListInfo(getTimeCriticalTodosWithListInfoObj({ listsWithToDos: loadedLists }))
    setPastDueToDosWithListInfo(getTimeCriticalTodosWithListInfoObj({ listsWithToDos: loadedLists, operator: '<' }))
    setUpcomingToDosWithListInfo(getTimeCriticalTodosWithListInfoObj({ listsWithToDos: loadedLists, operator: '>' }))
    setImportantToDosWithListInfo(getTimeCriticalTodosWithListInfoObj({ listsWithToDos: loadedLists, importance: 'important' }))
    setUrgentToDosWithListInfo(getTimeCriticalTodosWithListInfoObj({ listsWithToDos: loadedLists, importance: 'urgent' }))
  }, [loadedLists])



  return (
    <>
      <div className='flex flex-wrap gap-8'>
        {dueTodayToDosWithListInfo && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDosWithListInfo={dueTodayToDosWithListInfo}
              ListTitle='Due Today'
              maxWidthTailWindSize='lg'
              daisyUIBackgroundColor='bg-warning'
              daisyUITextColor='text-warning-content'
            />
          </div>
        )}

        {pastDueToDosWithListInfo && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDosWithListInfo={pastDueToDosWithListInfo}
              ListTitle='Past Due'
              maxWidthTailWindSize='lg'
              daisyUIBackgroundColor='bg-error'
              daisyUITextColor='text-error-content'
            />
          </div>
        )}

        {urgentToDosWithListInfo && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDosWithListInfo={urgentToDosWithListInfo}
              ListTitle='Urgent'
              maxWidthTailWindSize='lg'
              daisyUIBackgroundColor='bg-accent-focus'
              daisyUITextColor='text-accent-content'
            />
          </div>
        )}

        {importantToDosWithListInfo && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDosWithListInfo={importantToDosWithListInfo}
              ListTitle='Important'
              maxWidthTailWindSize='lg'
              daisyUIBackgroundColor='bg-success'
              daisyUITextColor='text-success-content'
            />
          </div>
        )}

        {upcomingToDosWithListInfo && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDosWithListInfo={upcomingToDosWithListInfo}
              ListTitle='Upcoming'
              maxWidthTailWindSize='lg'
              daisyUIBackgroundColor='bg-info'
              daisyUITextColor='text-info-content'
            />
          </div>
        )}


 
      </div>
    </>
  )
}

export default DisplayImportantLists


interface ToDosWithListInfoProps {
  listsWithToDos: ListAndToDos[];
  operator?: '>' | '<' | '===';
  date?: Date;
  importance?: 'urgent' | 'important';
}

export function getTimeCriticalTodosWithListInfoObj({ listsWithToDos, operator = '===', date, importance }: ToDosWithListInfoProps): ToDosWithListInfo[] {
  let now;
  !date ? now = new Date() : now = date
  const formattedNow = format(now, 'yyyy-MM-dd');

  const ToDosWithListInfo = listsWithToDos.map(list => {
    const ToDosArray = list.todos.filter(todo => {
      if (importance) {
        if (importance === 'urgent') return todo.urgent === true;
        if (importance === 'important') return todo.important === true;
      } else {
        if (!todo.dueDate) return false
        if (operator === '>') return format(todo.dueDate, 'yyyy-MM-dd') > formattedNow;
        if (operator === '<') return format(todo.dueDate, 'yyyy-MM-dd') < formattedNow;
        if (operator === '===') return format(todo.dueDate, 'yyyy-MM-dd') === formattedNow;
      }
      return false;
    })
    if (ToDosArray.length === 0) return null;

    const ToDosWithListInfoObject: ToDosWithListInfo = {
      listTitle: list.title,
      listId: list.id,
      projectId: list.projectId || null,
      outcomeId: list.outcomeId || null,
      todos: ToDosArray,
    }
    return ToDosWithListInfoObject
  })

  const filteredToDosWithListInfo = ToDosWithListInfo.filter((todos) => todos !== null) as ToDosWithListInfo[]
  return filteredToDosWithListInfo
}


