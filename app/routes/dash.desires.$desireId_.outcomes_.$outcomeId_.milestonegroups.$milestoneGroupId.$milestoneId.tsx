import { parse } from 'querystring'
import { useEffect, useState } from 'react';

import Modal from '~/components/modals/Modal'
import { redirect } from '@remix-run/server-runtime'
import { DefaultFormWidth } from '~/components/utilities/constants';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import MilestoneForm from '~/components/forms/milestones/MilestoneForm';
import { getMilestoneById, updateMilestone } from '~/models/milestone.server';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';


import type { Milestone } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import type { MilestoneWithStrDates } from '~/types/milestoneTypes';

// export const loader = async ({ request, params }: LoaderArgs) => {
  // const milestoneId = params.milestoneId
  // if (!milestoneId) throw new Error('No milestoneId was provided')
  // try {
  //   const milestone = await getMilestoneById(milestoneId)
  //   return { milestone }
  // } catch (error) { throw error }
// }

export const action = async ({ request, params }: LoaderArgs) => {
  const requestString = await request.text();
  const milestoneData = JSON.parse(parse(requestString).milestoneString as string);
  try {
    await updateMilestone(milestoneData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditMilestonePage() {

  const loadedMilestone = useGetMilestone();
  const [milestone, setMilestone] = useState<Milestone>()


  useEffect(() => {
    if (!loadedMilestone) return
    if (loadedMilestone === undefined) return
    setMilestone(loadedMilestone)
  }, [loadedMilestone])


  return (
    <>
      <Outlet />
      <Modal onClose={() => { }} zIndex={40}>
        <div className={`w-[${DefaultFormWidth}] min-w-[250px] felx-1`}>
          {/* <MilestoneForm milestone={milestone} isNew={false} /> */}
        </div>
      </Modal>
    </>
  )
}

export default EditMilestonePage


export const useGetMilestone = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [milestone, setMilestone] = useState<Milestone>();
  const loadedMilestoneWithStrDates: MilestoneWithStrDates = loaderData.milestone;
  if (!loadedMilestoneWithStrDates) navigate('../')

  useEffect(() => {
    if (!loadedMilestoneWithStrDates) return
    const loadedMilestone: MilestoneWithStrDates[] = [loadedMilestoneWithStrDates];
    const datekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
    const milestoneWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: loadedMilestone, dateKeys: datekeys });
    setMilestone(milestoneWithProperDates[0]);
  }, [loadedMilestoneWithStrDates, navigate]);

  return milestone;
}
