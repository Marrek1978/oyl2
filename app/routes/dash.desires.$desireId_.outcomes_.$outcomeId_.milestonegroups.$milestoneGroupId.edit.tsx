import { redirect } from '@remix-run/node';

import Modal from '~/components/modals/Modal'
import MilestoneGroupForm from '~/components/forms/milestones/MilestoneGroupForm'
import { getMilestoneGroupById, updateMilestoneGroupById } from '~/models/milestoneGroup.server';

import type { LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { parse } from 'querystring';
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';

import type { UpdateMilestoneGroup } from '~/types/milestoneTypes';


export const loader = async ({ request, params }: LoaderArgs) => {
  const { milestoneGroupId } = params
  if (!milestoneGroupId) return 'noId'
  try {
    const milestoneGroup = await getMilestoneGroupById(milestoneGroupId)
    return milestoneGroup
  } catch (error) { return 'noId' }
}

export const action = async ({ request, params }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const milestoneGroupData: UpdateMilestoneGroup = {
    id: parsedBody.rowId as string,
    title: parsedBody.title as string,
    description: parsedBody.description as string,
  }
  try {
    await updateMilestoneGroupById(milestoneGroupData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditMilestoneGroupPage() {

  const loaderData = useLoaderData()
  // const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(loaderData)


  return (
    <>
      <Outlet />
      {/* {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )} */}
      <Modal zIndex={40} >

        <MilestoneGroupForm
          isNew={false}
          milestoneGroup={loaderData}
        />
      </Modal>
    </>
  )
}

export default EditMilestoneGroupPage

