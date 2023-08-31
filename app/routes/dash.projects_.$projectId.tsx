import { Outlet, useLoaderData } from '@remix-run/react'

import { getDesires } from '~/models/desires.server'
import { requireUserId } from '~/models/session.server'
import { getProjectById } from '~/models/project.server'
import { getOutcomesByDesireId } from '~/models/outcome.server'
import ProjectDisplay from '~/components/projects/ProjectDisplay'
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs'

import type { Desire } from '@prisma/client'
import type { LoaderArgs } from '@remix-run/server-runtime'

export const loader = async ({ request, params }: LoaderArgs) => {
  let userId = await requireUserId(request);
  const projectId = params.projectId!
  try {
    const desires = await getDesires(userId)
    const project = await getProjectById(projectId, userId)
    if (!project) throw new Error('Project not found')
    const desire = desires.find((desire: Desire) => desire.id === project?.desireId)
    const outcomes = await getOutcomesByDesireId(desire?.id || '0')

    return { project, desires, outcomes }
  } catch (error) { throw error }
}

export default function ProjectByIdPage() {

  const { project, desires } = useLoaderData()
  const desire = desires.find((desire: Desire) => desire.id === project.desireId)

  return (
    <>
      <BreadCrumbs title={project.title || ''} />
      <Outlet />
      <div className='flex-1 w-full'>
        <ProjectDisplay
          project={project}
          desire={desire}
        />
      </div>
    </>
  )
}
