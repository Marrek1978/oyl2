import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { sortTodos } from '../utilities/helperFunctions'
import TimeCriticalTodoListCard from '../list/timeCritical/TimeCriticalTodoListCard'

import type { List, ToDo } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'


type Props = {
  loadedLists: ListAndToDos[]
}


export type ListInfoWithToDos = {
  listTitle: List['title'];
  listId: List['id'];
  outcomeId: List['outcomeId'];
  todos: ToDo[];
}

function DisplayImportantLists({ loadedLists }: Props) {
  const [pastDueToDos, setPastDueToDos] = useState<ToDo[]>()
  const [dueTodayToDos, setDueTodayToDos] = useState<ToDo[]>()
  const [urgentToDos, setUrgentToDos] = useState<ToDo[]>()
  const [importantToDos, setImportantToDos] = useState<ToDo[]>()
  const [upcomingToDos, setUpcomingToDos] = useState<ToDo[]>()

  useEffect(() => {
    if (!loadedLists) return
    setPastDueToDos(getAndSortTodosFromLists({ listsWithToDos: loadedLists, operator: '<' }))
    setDueTodayToDos(getAndSortTodosFromLists({ listsWithToDos: loadedLists , operator: '=' }))
    setUrgentToDos(getAndSortTodosFromLists({ listsWithToDos: loadedLists, importance: 'urgent' }))
    setImportantToDos(getAndSortTodosFromLists({ listsWithToDos: loadedLists, importance: 'important' }))
    setUpcomingToDos(getAndSortTodosFromLists({ listsWithToDos: loadedLists, operator: '>' }))

  }, [loadedLists])

  return (
    <>
      <div className='flex flex-wrap gap-8 mt-4'>

        {pastDueToDos && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDos={pastDueToDos}
              ListTitle='Past Due'
              due='past'
              linkUrl={'timeCriticalToDos/?type=<'}
            />
          </div>
        )}

        {dueTodayToDos && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDos={dueTodayToDos}
              ListTitle='Due Today'
              due='today'
              linkUrl={'timeCriticalToDos/?type=='}
            />
          </div>
        )}

        {urgentToDos && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDos={urgentToDos}
              ListTitle='Urgent'
              linkUrl={'timeCriticalToDos/?type=urgent'}
            />
          </div>
        )}

        {importantToDos && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDos={importantToDos}
              ListTitle='Important'
              linkUrl={'timeCriticalToDos/?type=important'}
            />
          </div>
        )}

        {upcomingToDos && (
          <div className='flex-1'>
            <TimeCriticalTodoListCard
              toDos={upcomingToDos}
              ListTitle='Upcoming'
              due='upcoming'
              linkUrl={'timeCriticalToDos/?type=>'}
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
  operator?: '>' | '<' | '=';
  date?: Date;
  importance?: 'urgent' | 'important';
}

export function getTimeCriticalTodosWithListInfoObj({ listsWithToDos, operator = '=', date, importance }: ToDosWithListInfoProps): ListInfoWithToDos[] {
  let now;
  !date ? now = new Date() : now = date
  const formattedNow = format(now, 'yyyy-MM-dd');

  const ToDosWithListInfo = listsWithToDos.map(list => {
    const ToDosArray = list.todos.filter(todo => {
      if (importance) {
        if (importance === 'urgent') return todo.isUrgent === true;
        if (importance === 'important') return todo.isImportant === true;
      } else {
        if (!todo.dueDate) return false
        if (operator === '>') return format(todo.dueDate, 'yyyy-MM-dd') > formattedNow;
        if (operator === '<') return format(todo.dueDate, 'yyyy-MM-dd') < formattedNow;
        if (operator === '=') return format(todo.dueDate, 'yyyy-MM-dd') === formattedNow;
      }
      return false;
    })
    if (ToDosArray.length === 0) return null;

    const ToDosWithListInfoObject: ListInfoWithToDos = {
      listTitle: list.title,
      listId: list.id,
      outcomeId: list.outcomeId || null,
      todos: ToDosArray,
    }
    return ToDosWithListInfoObject
  })

  const filteredToDosWithListInfo = ToDosWithListInfo.filter((todos) => todos !== null) as ListInfoWithToDos[]
  return filteredToDosWithListInfo
}


export function getToDosFromListsofToDos(listsWithToDos: ListInfoWithToDos[]): ToDo[] {
  const ToDosArray = listsWithToDos.map(list => {
    return list.todos
  }).flat()

  return ToDosArray
}


export function getAndSortTodosFromLists({ listsWithToDos, operator = '=', date, importance }: ToDosWithListInfoProps): ToDo[] {
  return sortTodos(getToDosFromListsofToDos(getTimeCriticalTodosWithListInfoObj({ listsWithToDos, operator, date, importance })))
}