import { parse } from 'querystring'
import { useEffect, useState } from 'react';
import { redirect } from '@remix-run/server-runtime'
import { Outlet, useParams } from '@remix-run/react';

import Modal from '~/components/modals/Modal'
import { updateMilestone } from '~/models/milestone.server';
import MilestoneForm from '~/components/forms/milestones/MilestoneForm';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import { useGetMilestoneGroupWithMilestones } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId';

import type { Milestone } from '@prisma/client';
import type { LoaderFunctionArgs } from '@remix-run/node';
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';


export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const requestString = await request.text();
  const milestoneData = JSON.parse(parse(requestString).milestoneString as string);
  try {
    await updateMilestone(milestoneData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditMilestonePage() {

  const [milestone, setMilestone] = useState<Milestone>()
  const loadedMilestone: Milestone | undefined | null = useGetMilestone();
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: loadedMilestone, itemType: 'Milestone ' })


  useEffect(() => {
    if (!loadedMilestone) return
    if (loadedMilestone === undefined) return
    setMilestone(loadedMilestone)
  }, [loadedMilestone])


  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      <Modal onClose={() => { }} zIndex={40}>
        <div className={`formWidth min-w-[250px] felx-1`}>
          <MilestoneForm milestone={milestone} isNew={false} />
        </div>
      </Modal>
    </>
  )
}

export default EditMilestonePage


export const useGetMilestone = (): Milestone | null | undefined => {
  const params = useParams()
  const { milestoneId } = params
  const loaderData: MilestoneGroupsWithMilestones | null | undefined = useGetMilestoneGroupWithMilestones()
  const [milestone, setMilestone] = useState<Milestone | undefined | null>()

  useEffect(() => {
    if (!loaderData) return
    const milestonesArray = loaderData.milestones as Milestone[]
    const milestoneByParamId = milestonesArray.find(milestone => milestone.id === milestoneId)
    if (!milestoneByParamId) return setMilestone(null)
    setMilestone(milestoneByParamId as Milestone)
  }, [loaderData, milestoneId])


  return milestone;
}
