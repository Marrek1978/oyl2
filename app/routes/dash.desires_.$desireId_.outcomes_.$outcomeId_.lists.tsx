import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { Outlet, useParams, useRouteLoaderData } from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import DndLists from '~/components/dnds/lists/DndLists';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import { getListsByOutcomeId, updateListsOrder } from '~/models/list.server';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';

import type { List } from '@prisma/client';
import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes';

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request)
  const { outcomeId } = params
  if (!outcomeId) throw new Error('No outcomeId in URL')

  try {
    const loaderLists = await getListsByOutcomeId(userId, outcomeId)
    return loaderLists
  } catch (error) { return error }
}


export const action = async ({ request }: ActionArgs) => {
  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const listsObj = JSON.parse(parsedBody.toServerDataString as string);
    const list = listsObj.sortableArray
    try {
      await updateListsOrder(list)
      return 'success'
    } catch (error) { return 'failed' }
  }
  return null
}



function OutcomeListsPage() {
  const lists: ListAndToDos[] = useGetListsWithTodos()


  const params = useParams()
  const [breadcumbTitle3, setBreadcumbTitle3] = useState<string>()

  useEffect(() => {
    if (params.listId) {
      setBreadcumbTitle3('List')
    }
    else {
      setBreadcumbTitle3(undefined)
    }
  }, [params])


  return (
    <>
      <BreadCrumbs
        secondCrumb={'Desire'}
        title2={'Outcome'}
        title3={breadcumbTitle3}
      />
      <DndAndFormFlex
        dnd={<DndLists passedLists={lists} />}
        form={<Outlet />}
        formMaxWidthPx='1200px'
      />
    </>
  )
}

export default OutcomeListsPage



export const useGetLoaderData = ({ path = `routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists` }): ListAndTodosWithStrDates[] => {
  const [loadedLists, setLoadedLists] = useState<ListAndTodosWithStrDates[]>([])
  const loadedData: ListAndTodosWithStrDates[] | undefined = useRouteLoaderData(path)

  useEffect(() => {
    if (!loadedData) return
    setLoadedLists(loadedData)
  }, [loadedData])

  return loadedLists
}


export const useGetListsWithTodos = (): ListAndToDos[] => {
  const [lists, setLists] = useState<ListAndToDos[]>([])
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (loadedLists === undefined) return
    const listsWithProperDates: ListAndToDos[] = loadedLists.map((list: ListAndTodosWithStrDates) => {
      const listWithProperDates = ObjectStrToDates({ item: list, dateKeys: ['createdAt', 'updatedAt'] })
      const todosWithProperDates = ArrayOfObjectsStrToDates({ items: list.todos, dateKeys: ['createdAt', 'updatedAt', 'dueDate'] })
      return {
        ...listWithProperDates,
        todos: todosWithProperDates
      }
    })
    setLists(listsWithProperDates)
  }, [loadedLists])

  return lists
}


export const useGetListsOnly = (): List[] => {
  const [lists, setLists] = useState<List[]>([])
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (!loadedLists) return
    const listsOnly = loadedLists.map((list: ListAndTodosWithStrDates) => {
      const { todos, ...listOnly } = list
      return listOnly
    })
    const listWithProperDates = ArrayOfObjectsStrToDates({ items: listsOnly, dateKeys: ['createdAt', 'updatedAt'] })
    setLists(listWithProperDates)
  }, [loadedLists])

  return lists
}

export const useGetListsArrayLength = (): number => {
  const [listsLength, setListsLength] = useState<number>()
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})

  useEffect(() => {
    if (!loadedLists) return setListsLength(0)
    setListsLength(loadedLists.length)
  }, [loadedLists])

  return listsLength || 0
}