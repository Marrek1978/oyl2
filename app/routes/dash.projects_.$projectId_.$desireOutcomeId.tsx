
import {  Outlet, useLoaderData } from '@remix-run/react'

import { getDesireById } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server'
import { getProjectById } from '~/models/project.server'
import { getOutcomeByOutcomeId } from '~/models/outcome.server'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import ProjectTasksForOutcome from '~/components/projects/ProjectTasksForOutcome'

import type { LoaderArgs } from '@remix-run/server-runtime'

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
  console.log('outcome', outcome)
  // console.log('desire', desire)



  return (
    <>
     <BreadCrumbs title={project.title || ''} title2={outcome.title}/>
    <Outlet />
      <ProjectTasksForOutcome
        project={project}
        desire={desire}
        outcome={outcome}
        />
    </>
  )
}

export default OutcomeTasksPage