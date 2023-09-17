import { redirect } from '@remix-run/server-runtime';
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteDesire } from '~/models/desires.server';
import { useGetDesireWithValuesAndOutcomes } from './dash.desires';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const desireData = Object.fromEntries(formData);
  const desireId = desireData.rowId as string
  try {
    await deleteDesire({ desireId })
    return redirect('/dash/desires')
  } catch (error) { throw error }
}


function DeleteDesirePage() {

  const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes({ route: 'routes/dash.desires' });
  const title = desire?.title || ''
  const desireId = desire?.id || ''


  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'desire'}
          title={title}
          id={desireId}
        />
      </Modal>
    </>
  )
}

export default DeleteDesirePage