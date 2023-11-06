import React from 'react'


import { parse } from 'querystring';
import type { ActionArgs } from '@remix-run/server-runtime';

import { createList } from '~/models/list.server';
import ListForm from '~/components/forms/ListForm'
import { requireUserId } from '~/models/session.server';
import { useGetMiscLists } from '~/routes/dash.listsandroutines';
import Modal from '~/components/modals/Modal';


export const action = async ({ request }: ActionArgs) => {
  console.log("🚀 ~ file:   ~ action ~ request:")

  if (request.method === 'POST') {
    console.log("🚀 ~ file: ~ action ~ POST:")
    const userId = await requireUserId(request);
    const formBody = await request.text();
    const parsedBody = parse(formBody);

    const title = parsedBody.title as string;
    const sortOrder = parsedBody.sortOrder ? parseInt(parsedBody.sortOrder as string) : 0;
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



function NewMiscList() {
  const nextSortOrder = GetMiscListsArrayLength()

  return (
    <>
      <Modal zIndex={20}>
        <div className='modalFormWidth__lg'>
          <ListForm nextSortOrder={nextSortOrder} isNewInModal={true} isNew={true} isShowDeleteBtn={false} />
        </div>
      </Modal>
    </>
  )
}

export default NewMiscList


export const GetMiscListsArrayLength = () => {
  const miscListsArray = useGetMiscLists()
  const miscListsArrayLength = miscListsArray.length
  return miscListsArrayLength
}