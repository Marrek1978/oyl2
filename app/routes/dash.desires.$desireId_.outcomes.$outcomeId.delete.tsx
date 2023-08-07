import { useMatches, useParams } from '@remix-run/react';
import { ActionArgs, redirect } from '@remix-run/server-runtime';
import React from 'react'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import Modal from '~/components/modals/Modal'
import { deleteOutcomeById } from '~/models/outcome.server';
import { OutcomeWithProgressList } from '~/types/outcomeTypes';


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

  const params = useParams();
  const matches = useMatches();
  const outcomes: OutcomeWithProgressList[] = matches.find(match => match.id === 'routes/dash.desires.$desireId_.outcomes')!.data
  if (!outcomes) throw new Error('Outcome not found')
  const outcome: OutcomeWithProgressList = outcomes.find((outcome: OutcomeWithProgressList) => outcome.id === params.outcomeId)!
  const outcomeTitle = outcome.title
  const outcomeId = outcome.id


  return (
    <>
      <Modal onClose={() => { }} zIndex={30}>
        <AreYouSureDeleteModal
          item={'Outcome'}
          title={outcomeTitle}
          id={outcomeId}
        />
      </Modal>
    </>
  )
}

export default DeleteOutcomePage