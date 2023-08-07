import React from 'react'

import { redirect, type ActionArgs } from '@remix-run/server-runtime'
import Modal from '~/components/modals/Modal'
import { useMatches, useParams, Outlet } from '@remix-run/react'
import type { DesireWithValues } from '~/types/desireTypes'
import type { Desire } from '@prisma/client'
import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'
import type { OutcomeWithProgressList } from '~/types/outcomeTypes'
// import { createDesireOutcomeAndProgressList } from '~/models/outcome.server';

// import { requireUserId } from '~/models/session.server'
import { parse } from 'querystring'
import { updateDesireOutcomeAndProgressList } from '~/models/outcome.server'


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);
  try {
    await updateDesireOutcomeAndProgressList(outcomeData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditOutcomePage() {

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  const outcomes: OutcomeWithProgressList[] = matches.find(match => match.id === 'routes/dash.desires.$desireId_.outcomes')!.data
  if (!outcomes) throw new Error('outcomes not found')
  const outcome: OutcomeWithProgressList = outcomes.find((outcome: OutcomeWithProgressList) => outcome.id === params.outcomeId)!

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <DesiresOutcomesForm
          desire={desire}
          outcome={outcome}
        />
      </Modal>
    </>
  )
}

export default EditOutcomePage