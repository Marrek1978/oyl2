import { Outlet, useLoaderData } from '@remix-run/react';
import { redirect, type ActionFunctionArgs, type LoaderFunction, type LoaderFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import ProjectsForm from '~/components/forms/ProjectsForm'
import { requireUserId } from '~/models/session.server';
import { getDesireById, getDesiresByUserId } from '~/models/desires.server';
import { getProjectById, getProjects, updateProjectDetails } from '~/models/project.server';

import type { Project } from '@prisma/client';
import type { ProjectValidationErrorsTypes } from '~/types/projectTypes';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectId = params.projectId!;   // const project = getProjectById(params.projectId, userId)
  try {
    const allUserProjects = await getProjects(userId)
    const project = await getProjectById(projectId, userId);
    const desireId = project?.desireId
    const allUserDesires = await getDesiresByUserId(userId)
    let desire;
    if (desireId) {
      desire = await getDesireById(desireId, userId)
    }
    return { project, allUserDesires, desire, allUserProjects };
  } catch (error) { throw error }
};

export const action = async ({ request }: ActionFunctionArgs) => {
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

  const { project, desire, allUserDesires, allUserProjects } = useLoaderData()

  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={10}>
        <ProjectsForm
          project={project}
          desire={desire}
          allUserDesires={allUserDesires}
          allUserProjects={allUserProjects}
        />
      </Modal>
    </>
  )
}

export default EditProjectPage
