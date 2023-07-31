import { useMatches, useParams } from '@remix-run/react';
import { redirect, type ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import ProjectsForm from '~/components/forms/ProjectsForm'
import { requireUserId } from '~/models/session.server';
import { updateProjectDetails } from '~/models/project.server';

import type { Project } from '@prisma/client';
import type { ProjectValidationErrorsTypes } from '~/types/projectTypes';

export const action = async ({ request }: ActionArgs) => {
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
    id: projectData.projectId as string,
    title: projectData.title as string,
    description: projectData.description as string,
    userId: userId as string,
    sortOrder: projectData.sortOrder ? parseInt(projectData.sortOrder as string) : 0,
    desireId: projectData.desireId as string || null,
  }

  try {
    await updateProjectDetails(project as Project)
    return redirect('..')
  } catch (error) { throw error }

}

function EditProjectPage() {

  const matches = useMatches();
  const params = useParams();
  const projects = matches.find(match => match.id === 'routes/dash.projects')?.data.projects
  const project = projects?.find((project: Project) => project.id === params.projectId)

  return (
    <Modal onClose={() => { }} zIndex={10}>
      <ProjectsForm project={project} />
    </Modal>
  )
}

export default EditProjectPage
