import { parse } from 'querystring'
import { useEffect, useState } from 'react';
import { Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { getMilestoneGroupAndItsMilesonesById } from '~/models/milestoneGroup.server'
import { transformMilestoneGroupDataDates } from '~/components/utilities/helperFunctions'
import { updateMilestoneCompleted, updateMilestonesOrder } from '~/models/milestone.server'
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import MilestoneGroupHorizontalDisplay from '~/components/milestones/MilestoneGroupHorizontalDisplay';

import type { MilestoneGroup } from '@prisma/client';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { milestoneGroupId } = params
  if (!milestoneGroupId) return 'noId'
  try {
    const milestoneGroupWithMilestones = await getMilestoneGroupAndItsMilesonesById(milestoneGroupId);
    console.log('returning from loader to groupIdPage')
    return milestoneGroupWithMilestones
  } catch (error) { return 'noId' }
}



export const action = async ({ request, params }: ActionArgs) => {

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

  const loaderData = useLoaderData();
  const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroup>()
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(loaderData, 2)


  useEffect(() => {
    if (!loaderData) return
    const group = transformMilestoneGroupDataDates(loaderData)
    setMilestoneGroup(group as MilestoneGroup)
  }, [loaderData])


  return (
    <>
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}
      <Modal >
        <div className={`w-[1200px] min-w-[250px] felx-1`}>
          {milestoneGroup && (
            <MilestoneGroupHorizontalDisplay milestoneGroup={milestoneGroup} />
          )}
        </div>
      </Modal >
    </>
  )
}

export default MilestoneGroupPage


// export const useGetAllMilestonesForGroup = (): MilestoneGroupsWithMilestones | undefined => {

//   const navigate = useNavigate();
//   const loaderData = useLoaderData();
//   const { milestones: loadedMilestones, ...loadedGroup } = loaderData;
//   console.log('loadedGroup', loadedGroup)
//   console.log('loadedMilestones', loadedMilestones)
//   const [milestones, setMilestones] = useState<Milestone[]>([]);
//   const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroup>();

//   useEffect(() => {
//     if (!loadedGroup) return
//     const groupDatekeys = ['createdAt', 'updatedAt'];
//     const groupWithProperDates = ObjectStrToDates({item:loadedGroup, dateKeys:groupDatekeys})
//     console.log('groupWithProperDates', groupWithProperDates)
//     const groupWithStrDatesIntoArray: MilestoneGroupsWithStrDates[] = [groupWithStrDates];
//     const milestoneGroupWithProperDates = ArrayOfObjectsStrToDates({ items: groupWithStrDatesIntoArray, dateKeys: groupDatekeys });
//     setMilestoneGroup(milestoneGroupWithProperDates[0]);

//     console.log('milestoneGroupWithProperDates from helper', typeof milestoneGroupWithProperDates[0].createdAt)

//     if (milestonesWithStrDates) {
//       const milestonesDatekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
//       const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: milestonesWithStrDates, dateKeys: milestonesDatekeys });
//       setMilestones(milestonesWithProperDates);
//     }
//   }, [loaderData, navigate]);

//   if (milestoneGroup) {
//     return {
//       ...milestoneGroup,
//       milestones,
//     };
//   }
//   return undefined;
// }




