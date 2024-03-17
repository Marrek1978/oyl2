import { useEffect, useState } from 'react';
import { useLocation, useParams, } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { deleteScheduledItem } from '~/models/scheduler.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

import type { ScheduledItem } from '@prisma/client';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const itemData = Object.fromEntries(formData);
  const id = itemData.rowId as string
  try {
    await deleteScheduledItem(id)
    return 'deleted'
  } catch (error) { throw error }
}

function DeleteScheduleItem() {
  const params = useParams();
  const location = useLocation();
  const [title, setTitle] = useState<string>('')
  const [deleteItem, setDeleteItem] = useState<ScheduledItem | undefined>(undefined)
  const [itemsStateArray, setItemsStateArray] = useState<ScheduledItem[] | undefined>(undefined)

  const state = location.state;
  const itemToDeleteId = params.scheduledItemId as string

  useEffect(() => {
    if (!state.scheduleItemsState) return
    setItemsStateArray(state.scheduleItemsState)
  }, [state])

  useEffect(() => {
    if (!itemsStateArray) return
    const itemToDelete = itemsStateArray?.find((item: ScheduledItem) => item.id === itemToDeleteId)
    setDeleteItem(itemToDelete)
  }, [itemsStateArray, itemToDeleteId])

  useEffect(() => {
    if (!deleteItem) return
    setTitle(deleteItem.title)

  }, [deleteItem])


  useFormDeletedToastAndRedirect({ redirectTo: '/dash/schedule', message: 'Scheduled Item was deleted' })


 

  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        < AreYouSureDeleteModal
          item={'Scheduled Item'}
          title={title}
          id={itemToDeleteId}
        />
      </Modal>
    </>
  )
}

export default DeleteScheduleItem