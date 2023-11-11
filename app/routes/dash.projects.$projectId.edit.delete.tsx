import React from 'react'
import { redirect } from '@remix-run/server-runtime'
import { useMatches, useParams } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'

import type { Project } from '@prisma/client'
import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { deleteProjectById } from '~/models/project.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const projectData = Object.fromEntries(formData);
  const projectId = projectData.rowId as string
  try {
    await deleteProjectById(projectId)
    return redirect('/dash/projects')
  } catch (error) { throw error }
}


function DeleteProjectByIdPage() {

  const params = useParams();
  const projectId = params.projectId as string
  const matches = useMatches();
  const projects = matches.find(match => match.id === 'routes/dash.projects')?.data.projects
  const project = projects?.find((project: Project) => project.id === projectId)
  const title = project?.title


  return (
    <>
      <Modal onClose={() => { }} zIndex={20}>
        < AreYouSureDeleteModal
          item={'project'}
          title={title}
          id={projectId}
        />
      </Modal>
    </>
  )
}

export default DeleteProjectByIdPage


