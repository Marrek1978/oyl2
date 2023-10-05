import { useParams } from '@remix-run/react';
import { redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { useGetSpecificValue } from './dash.values';
import { deleteValue } from '~/models/values.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal';

import type { ActionArgs } from '@remix-run/server-runtime';


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const valueData = Object.fromEntries(formData);
  const id = valueData.rowId as string
  try {
    await deleteValue(id)
    return redirect('../..')
  } catch (error) { throw error }
}

function DeleteValuePage() {

  const params = useParams();
  const valueId = params.valueId as string

  const { value } = useGetSpecificValue(valueId)
  const title = value?.title || ''

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