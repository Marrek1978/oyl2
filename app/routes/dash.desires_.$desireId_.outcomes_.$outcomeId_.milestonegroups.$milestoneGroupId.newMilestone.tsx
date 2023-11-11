import { parse } from 'querystring';
import { redirect } from "@remix-run/node";
import { useEffect, useState } from 'react';
import { Outlet, useLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import { requireUserId } from '~/models/session.server';
import { DefaultFormWidth } from '~/components/utilities/constants';
import MilestoneForm from '~/components/forms/milestones/MilestoneForm';
import { createMilestone, updateMilestonesOrder } from '~/models/milestone.server';
import { getMilestoneGroupAndItsMilesonesById, getMilestoneGroupById } from '~/models/milestoneGroup.server';

import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';
import type { MilestoneGroupsWithMilestonesWithStringDates } from '~/types/milestoneTypes';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  await requireUserId(request);
  const { milestoneGroupId } = params;
  if (!milestoneGroupId) return redirect('/dash')

  try {
    const group = await getMilestoneGroupById(milestoneGroupId);
    if (!group) return redirect('..')
    const groupAndMilestones = await getMilestoneGroupAndItsMilesonesById(milestoneGroupId);
    return groupAndMilestones
  } catch (error) { throw error }
}


export const action = async ({ request, params }: ActionFunctionArgs) => {
  //sort order
  if (request.method === 'PUT') {
    const array = await request.text();
    const parsedBody = parse(array);
    const milestones = JSON.parse(parsedBody.itemsString as string);
    try {
      await updateMilestonesOrder(milestones)
      return 'Milestone Groups order was updated'
    } catch (error) { throw error }
  }

  //create new milestone
  if (request.method === 'POST') {
    const requestString = await request.text();
    const milestoneData = JSON.parse(parse(requestString).milestoneString as string);
    try {
      await createMilestone(milestoneData)
      return redirect('..')
    } catch (error) { throw error }
  }
  return null
}


function NewMilestonePage() {

  const [milestoneArrayLength, setMilestoneArrayLength] = useState<number>();
  const loadedMilestones: MilestoneGroupsWithMilestonesWithStringDates | undefined = useLoaderData()


  useEffect(() => {
    if (!loadedMilestones) return
    setMilestoneArrayLength(loadedMilestones.milestones.length)
  }, [loadedMilestones])


  return (
    <>
      <Outlet />
      <Modal zIndex={20} >
        <div className={`w-[${DefaultFormWidth}] min-w-[250px] `}>
          <MilestoneForm
            milestoneArrayLength={milestoneArrayLength} />
        </div>
      </Modal>
    </>
  )
}

export default NewMilestonePage









