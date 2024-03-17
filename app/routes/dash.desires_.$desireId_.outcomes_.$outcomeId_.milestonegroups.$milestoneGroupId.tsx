import { parse } from 'querystring'
import { useEffect, useState } from 'react';
import { Outlet, useParams } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/displays/modals/Modal'
import { updateMilestoneCompleted, updateMilestonesOrder } from '~/models/milestone.server'
import useInvalidItemIdAlertAndRedirect from '~/components/displays/modals/InvalidItemIdAlertAndRedirect';
import MilestoneGroupHorizontalDisplayWithDnd from '~/components/displays/milestones/MilestoneGroupHorizontalDisplayWithDnd';
import { useGetAllMilestoneGroupsForOutcome } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups';

import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';


export const action = async ({ request }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const submitedString = parsedBody.toServerDataString
    const actionType = JSON.parse(submitedString as string).actionType

    if (actionType === 'complete') {
      const milestone = JSON.parse(parsedBody.toServerDataString as string).milestone
      try {
        await updateMilestoneCompleted(milestone)
        return 'success'
      } catch (error) { return 'failed' }
    }

    if (actionType === 'editSortOrder') {
      const milestones = JSON.parse(parsedBody.toServerDataString as string).sortableArray
      try {
        await updateMilestonesOrder(milestones)
        return 'success'
      } catch (error) { return 'failed' }
    }
  }
  return null
}


function MilestoneGroupPage() {

  const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroupsWithMilestones>()
  const loadedGroup: MilestoneGroupsWithMilestones | null | undefined = useGetMilestoneGroupWithMilestones()
  console.log("🚀 ~  MilestoneGroupPage ~ loadedGroup:", loadedGroup)
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: loadedGroup, itemType: 'Milestone Group' })


  useEffect(() => {
    if (!loadedGroup) return
    setMilestoneGroup(loadedGroup as MilestoneGroupsWithMilestones)
  }, [loadedGroup])


  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      <Modal >
        <div className={`w-full min-w-[450px] formWidth`}>
          {milestoneGroup && (
            <MilestoneGroupHorizontalDisplayWithDnd milestoneGroup={milestoneGroup} />
          )}
        </div>
      </Modal >
    </>
  )
}

export default MilestoneGroupPage



export const useGetMilestoneGroupWithMilestones = (): MilestoneGroupsWithMilestones | null | undefined => {

  const params = useParams();
  const paramsMilestoneGroupId = params.milestoneGroupId
  const [group, setGroup] = useState<MilestoneGroupsWithMilestones | null | undefined>(undefined)
  const [allGroups, setAllGroups] = useState<MilestoneGroupsWithMilestones[]>()
  const allValidGroups: MilestoneGroupsWithMilestones[] = useGetAllMilestoneGroupsForOutcome()

  useEffect(() => {
    console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.tsx:88 ~ useEffect ~ allValidGroups:", allValidGroups)
    if (!allValidGroups) return
    setAllGroups(allValidGroups)
  }, [allValidGroups])

  useEffect(() => {
    if (!allGroups || allGroups.length === 0 || !paramsMilestoneGroupId) return
    const currentGroup: MilestoneGroupsWithMilestones | undefined = allGroups.find((group: MilestoneGroupsWithMilestones) => group.id === paramsMilestoneGroupId);
    console.log("🚀 ~ file: dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.tsx:96 ~ useEffect ~ currentGroup:", currentGroup)
    if (currentGroup === undefined) return setGroup(null)  // return null triggers navigate back with message
    setGroup(currentGroup)
  }, [allGroups, paramsMilestoneGroupId])

  return group
}




