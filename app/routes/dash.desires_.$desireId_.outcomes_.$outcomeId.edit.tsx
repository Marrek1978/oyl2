import { useEffect, useState } from 'react'
import { Outlet, useParams } from '@remix-run/react'
import { redirect, type ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { updateOutcome } from '~/models/outcome.server';
import OutcomesForm from '~/components/forms/OutcomesForm'
import { useGetOutcomeOnlyWithProperDates } from './dash.desires_.$desireId_.outcomes_.$outcomeId'

import type { Outcome } from '@prisma/client'


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const outcomeData = Object.fromEntries(formData);

  let outcome = {
    id: outcomeData.rowId as string,
    title: outcomeData.title as string,
    description: outcomeData.description as string,
    vision: outcomeData.vision as string,
  }

  try {
    await updateOutcome(outcome)
    return redirect(`..`)
  } catch (error) { throw error }
}



function EditOutcomePage() {

  const params = useParams()
  const loadedOutcome = useGetOutcomeOnlyWithProperDates()
  const [outcome, setOutcome] = useState<Outcome>()

  const { desireId } = params
  if (!desireId) throw new Error('No desireId in params')

  useEffect(() => {
    if (!loadedOutcome) return
    setOutcome(loadedOutcome)
  }, [loadedOutcome])


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <OutcomesForm
          passedDesireId={desireId}
          outcome={outcome}
          isNew={false}
        />
      </Modal>
    </>
  )
}

export default EditOutcomePage