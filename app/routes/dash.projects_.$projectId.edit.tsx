import { useLoaderData, useMatches } from '@remix-run/react'
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { requireUserId } from '~/models/session.server'
import ProjectsForm from '~/components/forms/ProjectsForm'
import { getProjects, updateProjectDetails } from '~/models/project.server'

import type { ProjectValidationErrorsTypes } from '~/types/projectTypes'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    const projects = await getProjects(userId)
    return { projects, userId }
  } catch (error) { throw error }
}

export const action = async ({ request }: ActionFunctionArgs) => {

  const userId = await requireUserId(request)
  const formData = await request.formData()
  const projectData = Object.fromEntries(formData);

  let validationErrors: ProjectValidationErrorsTypes = {};
  !projectData.title && (validationErrors.title = 'A title is required')
  if (!projectData.title) return validationErrors

  let desireIds: string[] = []
  for (let key in desireIds) {
    if (key.includes('desire-') && projectData[key] === 'on') {
      let desireId = key.split('-')[1]
      desireIds.push(desireId)
    }
  }

  let project = {
    id: projectData.projectId as string,
    title: projectData.title as string,
    description: ' ',
    userId: userId as string,
    sortOrder: projectData.sortOrder ? parseInt(projectData.sortOrder as string) : 0,
    desireId: projectData.desireId as string,
  }

  try {
    await updateProjectDetails(project)
    return redirect('..')
  } catch (error) { throw error }
}


function EditProjectPage() {

  const { projects } = useLoaderData()
  const matches = useMatches()
  const match = matches.filter(match => match.id === 'routes/dash.projects_.$projectId')
  const { desires, project } = match[0].data


  return (
    <Modal >
      <ProjectsForm
        allUserDesires={desires}
        allUserProjects={projects}
        project={project}
        isNew={false}
      />
    </Modal>
  )
}

export default EditProjectPage