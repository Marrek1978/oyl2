import { parse } from 'querystring'
import { useEffect, useState } from 'react';
import { Outlet, useParams } from '@remix-run/react'
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { updateMilestoneCompleted, updateMilestonesOrder } from '~/models/milestone.server'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import { ArrayOfObjectsStrToDates, ObjectStrToDates } from '~/components/utilities/helperFunctions'
import MilestoneGroupHorizontalDisplay from '~/components/milestones/MilestoneGroupHorizontalDisplay';
import { useGetAllMilestoneGroupsForOutcome } from './dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups';

import type { Milestone, MilestoneGroup } from '@prisma/client';
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes';


export const action = async ({ request }: ActionArgs) => {

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

  const loadedGroup = useGetMilestoneGroupWithMilestones()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(loadedGroup)
  const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroupsWithMilestones>()


  useEffect(() => {
    if (!loadedGroup) return
    const group = ObjectStrToDates({ item: loadedGroup, dateKeys: ['createdAt', 'updatedAt'] })
    setMilestoneGroup(group as MilestoneGroupsWithMilestones)
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
        <div className={`w-[90%] min-w-[250px] `}>
          {milestoneGroup && (
            <MilestoneGroupHorizontalDisplay milestoneGroup={milestoneGroup} />
          )}
        </div>
      </Modal >
    </>
  )
}

export default MilestoneGroupPage


export const useGetMilestoneGroupWithMilestones = (): MilestoneGroupsWithMilestones | null | undefined => {

  const params = useParams();
  const allValidGroups = useGetAllMilestoneGroupsForOutcome()
  const [group, setGroup] = useState<MilestoneGroupsWithMilestones | null | undefined>()

  const paramsMilestoneGroupId = params.milestoneGroupId

  useEffect(() => {
    if (!allValidGroups) return
    const group: MilestoneGroupsWithMilestones | null | undefined = allValidGroups?.find((group: MilestoneGroup) => group.id === paramsMilestoneGroupId)
    if (!group) return setGroup(null)
    if (!group.milestones) return setGroup(group)

    const groupMilestones = group.milestones
    const milestonesDatekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
    const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: groupMilestones, dateKeys: milestonesDatekeys });
    group.milestones = milestonesWithProperDates
    return setGroup(group)
  }, [allValidGroups, paramsMilestoneGroupId])

  return group
}




