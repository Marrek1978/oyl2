import { Link, Outlet, useLoaderData } from '@remix-run/react'

import Modal from '~/components/modals/Modal'
import TextBtn from '~/components/buttons/TextBtn'
import FormButtons from '~/components/forms/FormButtons'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG'
import DndMilestones from '~/components/dnds/milestones/DndMilestones'
import { getMilestoneGroupAndItsMilesonesById } from '~/models/milestoneGroup.server'

import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';
import { parse } from 'querystring'
import { updateMilestonesOrder } from '~/models/milestone.server'

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
    console.log('PUT')
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const milestones = JSON.parse(parsedBody.itemsString as string);

    try {
      await updateMilestonesOrder(milestones)
      return 'Milestones order was updated'
    } catch (error) { throw error }
  }

  // const formData = await request.formData()
  // const groupsData = Object.fromEntries(formData);

  // let group = {
  //   title: groupsData.title as string,
  //   description: groupsData.description as string,
  //   sortOrder: groupsData.sortOrder ? parseInt(groupsData.sortOrder as string) : 0,
  //   outcomeId: params.outcomeId as string,
  // }

  // try {
  //   await createMilestoneGroup(group);
  //   return 'success'
  // } catch (error) { throw error }


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
        <BasicFormAreaBG title={header} >
          <div className='m-8 flex flex-col gap-6'>

            {milestoneGroup?.description && (
              <div>
                <p>
                  {milestoneGroup?.description}
                </p>
              </div>
            )}

            <div>
              <DndMilestones
                passedMilestoneGroup={milestoneGroupWithMilestones}
                dndTitle={milestoneGroup.title}
              />

            </div>
            <div className='w-full flex justify-center'>
              <Link to='milestones '>
                <TextBtn text='Add Milestone' />
              </Link>
            </div>
            <FormButtons saveBtnTxt={'close'} isSaveable={true} />
          </div>
        </BasicFormAreaBG >
      </Modal >

    </>
  )
}

export default MilestoneGroupPage

