import { parse } from 'querystring'
import { useMatches, useParams, Outlet } from '@remix-run/react'
import { redirect, type ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import DesiresOutcomesForm from '~/components/forms/DesiresOutcomesForm'
import { updateDesireOutcomeAndProgressList } from '~/models/outcome.server'

import type { DesireWithValues } from '~/types/desireTypes'
import type { Desire, DesireOutcomeProgress } from '@prisma/client'
import type { DesireOutcomeProgressWithStringDates, OutcomeWithProgessWithStringDates, OutcomeWithProgressList } from '~/types/outcomeTypes'


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

  const outcomesWithStringDates: OutcomeWithProgessWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires.$desireId_.outcomes')!.data
  if (!outcomesWithStringDates) throw new Error('outcomes not found')
  const outcomeWithStringDates: OutcomeWithProgessWithStringDates = outcomesWithStringDates.find((outcome: OutcomeWithProgessWithStringDates) => outcome.id === params.outcomeId)!

  const progressListWithStringDates: DesireOutcomeProgressWithStringDates[] = outcomeWithStringDates.desireOutcomeProgress
  let progressList: DesireOutcomeProgress[] = [];

  progressList = progressListWithStringDates?.map((progress: DesireOutcomeProgressWithStringDates) => {
    return {
      ...progress,
      createdAt: new Date(progress.createdAt),
      updatedAt: new Date(progress.updatedAt),
      dueDate: new Date(progress.dueDate)
    }
  })

  const outcome: OutcomeWithProgressList = {
    ...outcomeWithStringDates,
    createdAt: new Date(outcomeWithStringDates.createdAt),
    updatedAt: new Date(outcomeWithStringDates.updatedAt),
    dueDate: new Date(outcomeWithStringDates.dueDate),
    desireOutcomeProgress: progressList,
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