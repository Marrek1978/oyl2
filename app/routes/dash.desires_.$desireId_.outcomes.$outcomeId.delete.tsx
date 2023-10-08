import { type ActionArgs, redirect } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteOutcomeById } from '~/models/outcome.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { useGetOutcome } from './dash.desires_.$desireId_.outcomes_.$outcomeId';

import type { Outcome } from '@prisma/client';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';


export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const outcomeData = Object.fromEntries(formData);
  const outcomeId = outcomeData.rowId as string
  try {
    await deleteOutcomeById(outcomeId)
    return redirect('../..')
  } catch (error) { throw error }
}


function DeleteOutcomePage() {

  // const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes();
  // let outcome:  Outcome | undefined = useGetOutcome(desire)

  // const outcomeTitle = outcome?.title
  // const outcomeId = outcome?.id


  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        {/* <AreYouSureDeleteModal
          item={'Outcome'}
          title={outcomeTitle || ''}
          id={outcomeId || ''}
        /> */}
      </Modal>
    </>
  )
}

export default DeleteOutcomePage