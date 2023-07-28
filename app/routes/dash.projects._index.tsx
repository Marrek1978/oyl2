import { type ActionArgs } from '@remix-run/server-runtime'

import ProjectsForm from '~/components/forms/ProjectsForm'
import { createProject } from '~/models/project.server'
import { requireUserId } from '~/models/session.server'

import type { ProjectValidationErrorsTypes } from '~/types/projectTypes'

export const action = async ({ request }: ActionArgs) => {
  //save new project
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const projectData = Object.fromEntries(formData);

  let validationErrors: ProjectValidationErrorsTypes = {};
  !projectData.title && (validationErrors.title = 'A title is required')
  !projectData.description && (validationErrors.description = 'A description is required')
  if (!projectData.title || !projectData.description) return validationErrors


  let desireIds: string[] = []
  for (let key in desireIds) {
    if (key.includes('desire-') && projectData[key] === 'on') {
      let desireId = key.split('-')[1]
      desireIds.push(desireId)
    }
  }

  let project = {
    title: projectData.title as string,
    description: projectData.description as string,
    userId: userId as string,
    sortOrder: projectData.sortOrder ? parseInt(projectData.sortOrder as string) : 0,
    desireId: projectData.desireId as string,
  }

  try {
    await createProject(project)
    return null
  } catch (error) { throw error }
}

function NewProjectsPage() {
  return (
    <ProjectsForm />
  )
}

export default NewProjectsPage