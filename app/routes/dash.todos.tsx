import React from 'react'
import type { LoaderArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { getListAndTodos } from '~/models/list.server';
import { requireUserId } from '~/models/session.server';
import ListCardV2 from '~/components/list/ListCardV2';
import { transformDataDates } from '~/components/utilities/helperFunctions';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import type { ListAndToDos } from '~/types/listTypes';
import { EditIcon } from '~/components/utilities/icons';

export const loader = async ({ request }: LoaderArgs) => {

  try {
    const userId = await requireUserId(request);
    const todoLists = await getListAndTodos({ userId });
    return json({ todoLists });
  } catch (error) {
    console.log('todos thorw error')
    throw error
  }
}

function TodosPage() {

  const initialData = useLoaderData<typeof loader>();

  // const allLists = transformDataDates(fetcher.data?.todoLists || initialData.todoLists);
  const allLists = transformDataDates(initialData.todoLists);
  // const recurringLists = allLists.filter((list: ListAndToDos) => list.is_recurring === true);
  const nonRecurringLists = allLists.filter((list: ListAndToDos) => list.is_recurring === false);


  return (
    <>
      <Outlet />
      <article className="relative w-full  ">
        <div className='flex justify-between items-end content-end mb-12'>
          <div className='text-4xl font-medium font-nanum tracking-wide'>To-Do Lists</div>
          <Link to='/dash/todos/new' >
            <div className='w-56'>
              <button
                className="
                w-full
                btn btn-primary btn-outline rounded-none font-mont">
                Make New List
                {EditIcon}
              </button>
            </div>
          </Link>
        </div>

        <div className='flex flex-wrap gap-6 mt-6'>
          {nonRecurringLists?.map((list: ListAndToDos) => (
            <ListCardV2
              key={list.id}
              listItem={list}
                      />
          ))}
        </div>
        {/* <div className='text-3xl font-medium mt-12'>Recuring Lists</div> */}
        {/* <div className='flex flex-wrap gap-6 mt-6'>
          {recurringLists?.map((list: ListAndToDos) => (
            <ListCard
              key={list.id}
              listItem={list}
              openCheckBoxModal={() => openCheckBoxModalById(list.id)}
              setOpenCheckboxModalId={setOpenCheckboxModalId}
              openCheckboxModalId={openCheckboxModalId}
              triggerRefreshRouteData={triggerRefreshRouteData}
            />
          ))} */}
        {/* </div> */}
      </article>
    </>
  )
}

export default TodosPage