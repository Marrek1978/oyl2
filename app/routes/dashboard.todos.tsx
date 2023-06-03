import React, { useEffect, useState } from 'react'
import { useFetcher, useLoaderData, } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { requireUserId } from '~/session.server';
import {
  createListAndTodos, getListAndTodos, updateToDoComplete,
  updateListAndTodos, deleteList, deleteCompletedToDosFromList
} from '~/models/list.server';

import ListCard from '~/components/list/ListCard'
import type { ListAndToDos, Todo } from '~/types/listTypes';
import AddListModal from '~/components/modals/AddListModal'
import { useList } from '~/components/list/ListContext';
import CheckBoxModal from '~/components/modals/CheckBoxModal';
import EditListModal from '~/components/modals/EditListModal';
import DeleteListModal from '~/components/modals/DeleteListModal';

//* delete lists

//? should there be categories for lists?  or is each title it's own category?
//? maybe later put projects into categories??? or push projects into a list?
//?  do i need to re-sort the lists?   and track their position?

//*******************    ACTIONS    *******************//
export const action = async ({ request }: ActionArgs) => {

  const userId = await requireUserId(request);
  const requestBody = await request.json();
  const { actionType } = requestBody

  if (actionType === 'updateToDoComplete') {
    const { todoId, complete } = requestBody;
    await updateToDoComplete({ id: todoId, complete });
    return redirect(request.url);
  } else if (actionType === 'createAddListToDB') {
    const { listTitle, isRecurring, todos } = requestBody;
    await createListAndTodos({ title: listTitle, userId, todos, is_recurring: isRecurring })
    return redirect(request.url);
  } else if (actionType === 'updateListInDB') {
    const { listId, listTitle, isRecurring, todos, } = requestBody;
    await updateListAndTodos({ id: listId, title: listTitle, userId, todos, is_recurring: isRecurring })
    return redirect(request.url);
  } else if (actionType === 'deleteCompletedToDosFromList') {
    const { listId } = requestBody;
    await deleteCompletedToDosFromList({ id: listId })
    return redirect(request.url);
  } else if (actionType === 'deleteList') {
    const { listId } = requestBody;
    await deleteList({ id: listId })
    return redirect(request.url);
  }
}


//*******************    LOADER    *******************//
export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const todoLists = await getListAndTodos({ userId });
  return json({ todoLists });
}


//*******************    PAGE    *******************//
const TodosPage = () => {
  const initialData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  const [openList, setOpenList] = useState<ListAndToDos | null>(null);
  const [openCheckboxModalId, setOpenCheckboxModalId] = useState<string | null>(null);
  const [openEditListModalBool, setOpenEditListModalBool] = useState<Boolean>(false);
  const [openDeleteListModalBool, setOpenDeleteListModalBool] = useState<Boolean>(false);

  const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();

  useEffect(() => {
    const fetchData = async () => {
      fetcher.load(location.pathname);
    };
    fetcher.state !== 'idle' && fetchData();
  }, [fetcher.state]);

  useEffect(() => {
    console.log('in useEffect to refresh data')
    refreshOpenListData();
  }, [fetcher.data]);

  function transformData(data: any) {
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt!),
      updatedAt: new Date(item.updatedAt!),
      todos: item.todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt!),
        updatedAt: new Date(todo.updatedAt!),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      })),
    }));
  }

  const allLists = transformData(fetcher.data?.todoLists || initialData.todoLists);
  const recurringLists = allLists.filter((list: ListAndToDos) => list.is_recurring === true);
  const nonRecurringLists = allLists.filter((list: ListAndToDos) => list.is_recurring === false);

  const handleAddListToDb = async () => {
    const response = await fetch(location.pathname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listTitle, isRecurring, todos, actionType: 'createAddListToDB', })
    })

    if (response.ok) {
      setListTitle('')
      setTodos([])
      setIsRecurring(false)
      triggerRefreshRouteData()
    }
    return response
  }

  const handleUpdateListInDb = async () => {
    const listId = openList?.id;
    const response = await fetch(location.pathname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId, listTitle, isRecurring, todos, actionType: 'updateListInDB', })
    })
    if (response.ok) {
      setListTitle('')
      setTodos([])
      setIsRecurring(false)
      triggerRefreshRouteData()
    }
    return response
  };

  const handleDeleteCompletedToDosFromList = async (completedTodos: Todo[]): Promise<Response> => {
    console.log('handleDeleteCompletedToDosFromList')
    const listId = openList?.id;
    const response = await fetch(location.pathname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId, actionType: 'deleteCompletedToDosFromList', })
    })

    if (response.ok) {
      setListTitle('')
      setTodos([])
      setIsRecurring(false)
      triggerRefreshRouteData()
    }
    return response
  }

  const handleDeleteList = async (): Promise<Response> => {
    const listId = openList?.id;
    console.log('listId', listId)
    const response = await fetch(location.pathname, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId, actionType: 'deleteList', })
    })

    if (response.ok) {
      setListTitle('')
      setTodos([])
      setIsRecurring(false)
      triggerRefreshRouteData()
    }
    return response


  }

  const openCheckBoxModalById = (id: string) => {
    const listById = allLists.find((item: Todo) => item.id === id);
    setOpenList(listById);
  }

  const refreshOpenListData = () => {
    console.log('refreshOpenListData')
    console.log('openList', openList)
    if (openList) {
      const listId = openList.id;
      const listById = allLists.find((item: Todo) => item.id === listId);
      setOpenList(listById);
    }
  }

  const openEditListModal = () => {
    setOpenEditListModalBool(true)
  }

  const closeEditListModal = () => {
    setOpenEditListModalBool(false)
  }

  //! turn into context?? maybe not... depends on how / if i use List Cards elsewhere
  async function triggerRefreshRouteData() {
    fetcher.submit(null, { method: 'GET' })
  }

  return (
    <>
      <article className="relative w-full  ">
        <div className='flex gap-4 items-end content-end mb-12'>
          <div className='text-4xl font-medium font-nanum tracking-wide'>To-Do Lists</div>
          <label htmlFor="add-list-modal" className=" uppercase">
            <div className='flex gap-2 hover:scale-105 transform transition-all duration-300'>
              <div className='text-primary font-mont font-semibold
              hover:cursor-pointer hover:text-primary-400
            ' >
                Make new List
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor"
                className="w-6 h-6 pb-1 text-primary  hover:cursor-pointer hover:text-primary-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
          </label>
        </div>

        <div className='flex flex-wrap gap-6 mt-6'>
          {nonRecurringLists?.map((list: ListAndToDos) => (
            <ListCard
              key={list.id}
              listItem={list}
              openCheckBoxModal={() => openCheckBoxModalById(list.id)}
              setOpenCheckboxModalId={setOpenCheckboxModalId}
              openCheckboxModalId={openCheckboxModalId}
              triggerRefreshRouteData={triggerRefreshRouteData}
            />
          ))}
        </div>
        <div className='text-3xl font-medium mt-12'>Recuring Lists</div>
        <div className='flex flex-wrap gap-6 mt-6'>
          {recurringLists?.map((list: ListAndToDos) => (
            <ListCard
              key={list.id}
              listItem={list}
              openCheckBoxModal={() => openCheckBoxModalById(list.id)}
              setOpenCheckboxModalId={setOpenCheckboxModalId}
              openCheckboxModalId={openCheckboxModalId}
              triggerRefreshRouteData={triggerRefreshRouteData}
            />
          ))}
        </div>


        {/*    //????  modals         ************************ */}
        <AddListModal
          saveFunction={handleAddListToDb}
        />

        {openList && (
          <CheckBoxModal
            listItem={openList}
            closeModal={() => setOpenList(null)}
            triggerRefreshRouteData={triggerRefreshRouteData}
            openEditListModal={openEditListModal}
            handleUpdateListInDb={handleUpdateListInDb}
            handleDeleteCompletedToDosFromList={handleDeleteCompletedToDosFromList}
            openDeleteListModal={() => setOpenDeleteListModalBool(true)}
          />
        )}

        {openList && openEditListModalBool === true && (
          <EditListModal
            saveEditsFunction={handleUpdateListInDb}
            listItem={openList}
            closeEditListModal={closeEditListModal}
          />
        )}

        {openList && openDeleteListModalBool === true && openDeleteListModalBool === true && (
          <DeleteListModal
            closeDeleteListModal={() => setOpenDeleteListModalBool(false)}
            handleDeleteList={handleDeleteList}

          />
        )}

      </article >
    </>
  )
}

export default TodosPage