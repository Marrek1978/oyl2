import { useEffect, useState } from 'react';
import { useParams, } from '@remix-run/react';

import Modal from '~/components/displays/modals/Modal'
import { useGetSpecificValue } from './dash.values';
import { deleteValue } from '~/models/values.server';
import AreYouSureDeleteModal from '~/components/displays/modals/AreYouSureDeleteModal';
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';

import type { Value } from '@prisma/client';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);
  const id = valueData.rowId as string
  try {
    await deleteValue(id)
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteValuePage() {
  const params = useParams();
  const [title, setTitle] = useState<string>('')

  const valueId = params.valueId as string
  const value = useGetSpecificValue(valueId) as Value

  useEffect(() => {
    if (!value) return
    setTitle(value.title)
  }, [value])

  useFormDeletedToastAndRedirect({ redirectTo: '/dash/values', message: 'Value was deleted' })

  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'Value'}
          title={title}
          id={valueId}
        />
      </Modal>
    </>
  )
}

export default DeleteValuePage