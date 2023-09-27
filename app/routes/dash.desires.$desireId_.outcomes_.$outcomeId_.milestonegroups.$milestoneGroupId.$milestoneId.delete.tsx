import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from '@remix-run/react';
import { redirect } from '@remix-run/node'
import type{ActionArgs, LoaderArgs} from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { deleteMilestoneById, getMilestoneById } from '~/models/milestone.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { parse } from 'querystring';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { milestoneId } = params;
  if (!milestoneId) throw new Error('No milestoneId was provided')
  try {
    const milestone = await getMilestoneById(milestoneId);
    console.log('milestone', milestone)
    if (!milestone) redirect('..')
    return milestone
  } catch (error) { throw error }
}

export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const milestoneId = parsedBody.rowId as string
  try {
    await deleteMilestoneById(milestoneId )
    return redirect('../..')
  } catch (error) { throw error }
}

function DeleteMilestonePage() {


  const navigate = useNavigate();
  const loaderData = useLoaderData();
  console.log('loaderData', loaderData)
  const [title, setTitle] = useState<string>('')
  const [id, setId] = useState<string>('')


  useEffect(() => {
    if (!loaderData || loaderData === null) return
    setTitle(loaderData?.title)
    setId(loaderData?.id)
  }, [loaderData, navigate])

  return (
    <>
      <Modal onClose={() => { }} zIndex={50}>
        <AreYouSureDeleteModal item={'Milestone'} title={title} id={id} />
      </Modal>
    </>
  )
}

export default DeleteMilestonePage


