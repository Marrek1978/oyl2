import {  Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime'

import { getDesireById } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server'
import { getProjectById } from '~/models/project.server'
import { getOutcomeByOutcomeId } from '~/models/outcome.server'
import OutcomeTasksDisplay from '~/components/projects/OutcomeTasksDisplay'


export const loader = async ({ request, params }: LoaderArgs) => {
  let userId = await requireUserId(request);
  const projectId = params.projectId!
  const desireOutcomeId = params.desireOutcomeId!

  try {
    const project = await getProjectById(projectId, userId)
    const outcome = await getOutcomeByOutcomeId(desireOutcomeId)
    const desire = await getDesireById(outcome!.desireId, userId)

    return { project, desire, outcome }

  } catch (error) { throw error }
}



type Props = {}


function OutcomeTasksPage({ }: Props) {

  const { project, desire, outcome } = useLoaderData()
  // console.log('projectId', projectId)
  // console.log('desireOutcomeId', desireOutcomeId)
  // console.log('project', project)
  // console.log('outcome', outcome)
  // console.log('desire', desire)



  return (
    <>
    <Outlet />
      <OutcomeTasksDisplay
        project={project}
        desire={desire}
        outcome={outcome}
        />
    </>
  )
}

export default OutcomeTasksPage