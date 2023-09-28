import { parse } from 'querystring'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLoaderData, useNavigate } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import TextBtn from '~/components/buttons/TextBtn'
import FormButtons from '~/components/forms/FormButtons'
import { DefaultFormWidth } from '~/components/dnds/constants'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG'
import DndMilestones from '~/components/dnds/milestones/DndMilestones'
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions'
import { getMilestoneGroupAndItsMilesonesById } from '~/models/milestoneGroup.server'
import { updateMilestoneCompleted, updateMilestonesOrder } from '~/models/milestone.server'

import type { Milestone, MilestoneGroup } from '@prisma/client'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';
import type { MilestoneGroupsWithMilestones, MilestoneGroupsWithMilestonesWithStringDates, MilestoneGroupsWithStrDates } from '~/types/milestoneTypes'

export const loader = async ({ request, params }: LoaderArgs) => {
  const groupId = params.milestoneGroupId;
  if (!groupId) throw new Error('No milestoneGroupId was provided')
  try {
    const milestoneGroupWithMilestones = await getMilestoneGroupAndItsMilesonesById(groupId);
    return { milestoneGroupWithMilestones }
  } catch (error) { throw error }
}


export const action = async ({ request, params }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const submitedString = parsedBody.submitedString
    const actionType = JSON.parse(submitedString as string).actionType

    if (actionType === 'complete') {
      const milestone = JSON.parse(parsedBody.submitedString as string).milestone
      try {
        await updateMilestoneCompleted(milestone)
        return null
      } catch (error) { throw error }
    }

    if (actionType === 'editOrder') {
      const milestones = JSON.parse(parsedBody.submitedString as string).milestonesArray
      try {
        await updateMilestonesOrder(milestones)
        return 'Milestones order was updated'
      } catch (error) { throw error }
    }
  }
  return null
}


function MilestoneGroupPage() {

  const loaderData = useLoaderData();
  const { milestoneGroupWithMilestones } = loaderData;
  const { milestones, ...milestoneGroup } = milestoneGroupWithMilestones;

  const header = (
    <>
      <div>
        <span className='text-sm' >
          Milestone Group:
        </span>
      </div>
      <div>
        {milestoneGroup.title}
      </div>
    </>)

  return (
    <>
      <Outlet />
      <Modal >
        <div className={`w-[${DefaultFormWidth}] min-w-[250px] felx-1`}>

          {/* //!  make component */}

          {/* // add spinners to dnd */}
          <BasicFormAreaBG title={header} >
            <div className='m-8 flex flex-col gap-8'>

              {milestoneGroup?.description && (
                <div>
                  <p>
                    {milestoneGroup?.description}
                  </p>
                </div>
              )}

              <div >
                <DndMilestones
                  passedMilestoneGroup={milestoneGroupWithMilestones}
                  dndTitle={milestoneGroup.title}
                />
              </div>

              <div className='w-full flex justify-center'>
                <Link to='newMilestone '>
                  <TextBtn text='Add Milestone' />
                </Link>
              </div>

              <FormButtons
                saveBtnTxt={'Save Milestones Order'}
                isSaveable={false}
                hideSaveBtn={true}
                showCloseBtn={true}
                closeBtnText='Close'
              />
            </div>
          </BasicFormAreaBG >
        </div>
      </Modal >
    </>
  )
}

export default MilestoneGroupPage


export const useGetAllMilestonesForGroup = (): MilestoneGroupsWithMilestones | undefined => {

  const navigate = useNavigate();
  const loaderData: MilestoneGroupsWithMilestonesWithStringDates = useLoaderData();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneGroup, setMilestoneGroup] = useState<MilestoneGroup>();


  useEffect(() => {
    if (!loaderData) return
    const { milestones: milestonesWithStrDates, ...groupWithStrDates } = loaderData;
    const groupWithStrDatesIntoArray: MilestoneGroupsWithStrDates[] = [groupWithStrDates];
    const groupDatekeys = ['createdAt', 'updatedAt'];
    const milestoneGroupWithProperDates: MilestoneGroup[] = ArrayOfObjectsStrToDates({ items: groupWithStrDatesIntoArray, dateKeys: groupDatekeys });
    setMilestoneGroup(milestoneGroupWithProperDates[0]);

    if (milestonesWithStrDates) {
      const milestonesDatekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
      const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: milestonesWithStrDates, dateKeys: milestonesDatekeys });
      setMilestones(milestonesWithProperDates);
    }
  }, [loaderData, navigate]);

  if (milestoneGroup) {
    return {
      ...milestoneGroup,
      milestones,
    };
  }
  return undefined;
}




