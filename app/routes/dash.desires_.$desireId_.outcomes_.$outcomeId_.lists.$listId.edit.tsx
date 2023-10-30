import { parse } from 'querystring';
import { Outlet } from '@remix-run/react';
import { useEffect, useState } from 'react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import ListForm from '~/components/forms/ListForm'
import { requireUserId } from '~/models/session.server';
import { updateListAndTodos } from '~/models/list.server';
import { sortTodos } from '~/components/utilities/helperFunctions';
import { useGetCurrentList } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId'

import type { ListAndToDos } from '~/types/listTypes'


export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const id = parsedBody.id as string;
  const title = parsedBody.title as string;
  const todos = JSON.parse(parsedBody.todosString as string);
  try {
    await updateListAndTodos({ id, title, userId, todos })
    return redirect('..')
  } catch (error) { throw error }

}


function EditListPage() {

  const loadedList = useGetCurrentList()
  const [list, setList] = useState<ListAndToDos>()

  useEffect(() => {
    if (!loadedList) return
    const todos = loadedList.todos
    const properlySortedTodos = sortTodos(todos);
    const newList = {
      ...loadedList,
      todos: properlySortedTodos
    }
    setList(newList)
  }, [loadedList])


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <div className={`modalFormWidth__lg flex-1 `}>
          <ListForm isNew={false} list={list} />
        </div>
      </Modal>
    </>
  )
}

export default EditListPage