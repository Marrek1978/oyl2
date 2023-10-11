import { Outlet, useRouteLoaderData } from '@remix-run/react'
import DndAndFormFlex from '~/components/baseContainers/DndAndFormFlex'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
// import ListForm from '~/components/forms/ListForm'

import { requireUserId } from '~/models/session.server';
import { parse } from 'querystring';
import { createList, getListsByOutcomeId, updateListsOrder } from '~/models/list.server';


import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';
import { useEffect, useState } from 'react';
import type { ListAndToDos, ListAndTodosWithStrDates } from '~/types/listTypes';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions';
import DndLists from '~/components/dnds/lists/DndLists';
import type { List } from '@prisma/client';
import ListForm from '~/components/forms/ListForm';


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
    console.log("🚀 ~ file:  ~ action ~ list:", list)
    try {
      await updateListsOrder(list)
      return 'success'
    } catch (error) { return 'failed' }
  }


  if (request.method === 'POST') {
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    console.log("🚀 ~ file: ~ action ~ parsedBody:", parsedBody)

    const title = parsedBody.title as string;
    const sortOrder =  parsedBody.sortOrder ? parseInt(parsedBody.sortOrder as string) : 0;
    let todos = [];
    if (parsedBody.todosString) {
      todos = JSON.parse(parsedBody.todosString as string);
    }
    const outcomeId = parsedBody.outcomeId as string;
    try {
      await createList({ title, userId, todos, outcomeId, sortOrder })
      return 'success'
    } catch (error) { return 'failed' }
  }

  return null
}






function OutcomeListsPage() {

  // const loadedListsAndToDos: ListAndToDos[] = useGetListsWithTodos()
  const lists: List[] = useGetListsOnly()
  // const [formState, setFormState] = useState<JSX.Element>()
  const nextSortOrder = useGetListsArrayLength()

  //   setFormState(<ListForm isNew={true} nextSortOrder={nextSortOrder} />)


  return (
    <>
      <BreadCrumbs secondCrumb={'Desire'} title2={'Outcome'} />
      <DndAndFormFlex
        dnd={<DndLists passedLists={lists} />}
        form={      <Outlet />
      }
        formMaxWidthPx='1200px'
      />

    </>
  )
}

export default OutcomeListsPage


export const useGetLoaderData = ({ path = `routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists` }): ListAndTodosWithStrDates[] => {

  const loadedData: ListAndTodosWithStrDates[] | undefined = useRouteLoaderData(path)
  const [loadedLists, setLoadedLists] = useState<ListAndTodosWithStrDates[]>([])

  useEffect(() => {
    if (!loadedData) return
    console.log('setting state')
    setLoadedLists(loadedData)
  }, [loadedData])
  return loadedLists
}


export const useGetListsWithTodos = (): ListAndToDos[] => {
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})
  const [lists, setLists] = useState<ListAndToDos[]>([])

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
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})
  const [lists, setLists] = useState<List[]>([])

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
  const loadedLists: ListAndTodosWithStrDates[] = useGetLoaderData({})

  const [listsLength, setListsLength] = useState<number>()

  useEffect(() => {
    if (!loadedLists) return setListsLength(0)
    setListsLength(loadedLists.length)
  }, [loadedLists])

  return listsLength || 0


}