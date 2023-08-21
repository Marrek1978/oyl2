import { parse } from 'querystring'
import { useMatches, useParams, Outlet } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'
import { updateDesireOutcome } from '~/models/outcome.server'

import type { DesireWithValues } from '~/types/desireTypes'
import type { Desire, DesireOutcome } from '@prisma/client'
import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const outcomeData = JSON.parse(parse(formBody).outcomeString as string);
  try {
    await updateDesireOutcome(outcomeData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditOutcomePage() {

  const params = useParams();
  const matches = useMatches();
  const desires: DesireWithValues[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const desire: DesireWithValues | undefined = desires?.find((desire: Desire) => desire.id === params.desireId)

  const outcomesWithStringDates: DesireOutcomeWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires.$desireId_.outcomes')!.data
  if (!outcomesWithStringDates) throw new Error('outcomes not found')
  const outcomeWithStringDates: DesireOutcomeWithStringDates = outcomesWithStringDates.find((outcome: DesireOutcomeWithStringDates) => outcome.id === params.outcomeId)!


  const outcome: DesireOutcome = {
    ...outcomeWithStringDates,
    createdAt: new Date(outcomeWithStringDates.createdAt),
    updatedAt: new Date(outcomeWithStringDates.updatedAt),
  }


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