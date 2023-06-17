import React from 'react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'
import { Link, useFetcher, useMatches, useParams } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue'

import type { ListAndToDos } from '~/types/listTypes'
import { closeIcon, trashIcon } from '~/components/utilities/icons'
import { deleteList } from '~/models/list.server'
import { parse } from 'querystring'

export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  try {
    await deleteList({ id: parsedBody.listId as string })
    return redirect('/dash/todos')
  } catch (error) { throw error }
}


function DeleteListPage() {

  const params = useParams();
  const matches = useMatches();
  const fetcher = useFetcher()

  const listId = params.listId as string
  const lists = matches.find(match => match.id === 'routes/dash.todos')?.data.todoLists
  const list = lists?.find((list: ListAndToDos) => list.id === params.listId)

  const title = list?.title
  const todosBoolean = list?.todos > 0

  const handleDeleteList = async () => {

    try {
      fetcher.submit({
        listId,
      }, {
        method: 'DELETE',
      })
    } catch (error) { throw error }
  }

  return (
    <Modal
      onClose={() => { }}
      zIndex={40}
    >
      <div className="card w-[500px] bg-base-100 
        rounded-none
        font-mont
        shadow-xl z-30
        ">
        <div className="card-body">
          <h2 className="text-2xl font-medium">
            Are you sure you want to delete the
            <span className='underline'> {title} </span> list
            {todosBoolean && ("and all of it's todos")}
          </h2>
          <p className='mt-2'>Deleting the list is permament</p>
          <div className="card-actions justify-between mt-8">
            <Link to='..' className='w-6/12 flex gap-2'>
              <SolidBtnGreyBlue
                text='Cancel Delete'
                onClickFunction={() => { }}
                icon={closeIcon}
              />
            </Link>
            <button
              className="btn btn-error rounded-none w-5/12"
              onClick={handleDeleteList}
              type='submit'
            >Delete List {trashIcon}</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteListPage