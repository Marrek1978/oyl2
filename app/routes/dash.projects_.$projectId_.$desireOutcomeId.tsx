
import { Outlet, useLoaderData } from '@remix-run/react'

import { getDesireById } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server'
import { getOutcomeByOutcomeId } from '~/models/outcome.server'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'
import ProjectTasksForOutcome from '~/components/projects/ProjectTasksForOutcome'

import type { LoaderArgs } from '@remix-run/server-runtime'
import { getProjectDesiredOutcomeListsAndToDos } from '~/models/list.server'
import { getProjectDesiredOutcomeRoutinesWithToDos } from '~/models/routines.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  let userId = await requireUserId(request);
  // const projectId = params.projectId!
  const outcomeId = params.desireOutcomeId!

  try {
    // const project = await getProjectById(projectId, userId)
    const outcome = await getOutcomeByOutcomeId(outcomeId)
    const desire = await getDesireById(outcome!.desireId, userId)
    const outcomeLists = await getProjectDesiredOutcomeListsAndToDos(userId, outcomeId)
    const outcomeRoutines = await getProjectDesiredOutcomeRoutinesWithToDos(userId,  outcomeId)
    return { desire, outcome, outcomeLists, outcomeRoutines }
  } catch (error) { throw error }
}


function OutcomeTasksPage() {

  const { desire, outcome, outcomeLists, outcomeRoutines } = useLoaderData()
  // console.log('projectId', projectId)
  // console.log('desireOutcomeId', desireOutcomeId)
  // console.log('project', project)
  // console.log('outcome', outcome)
  // console.log('desire', desire)
  // console.log('outcomeLists', outcomeLists)
  // console.log('outcomeRoutines', outcomeRoutines)



  return (
    <>
      <BreadCrumbs secondCrumb={outcome.title} />
      <Outlet />
      <ProjectTasksForOutcome
        desire={desire}
        outcome={outcome}
        outcomeLists={outcomeLists}
        outcomeRoutines={outcomeRoutines}
      />
    </>
  )
}

export default OutcomeTasksPage