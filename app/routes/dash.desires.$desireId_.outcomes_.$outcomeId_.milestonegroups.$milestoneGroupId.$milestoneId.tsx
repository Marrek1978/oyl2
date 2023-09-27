import { useEffect, useState } from 'react';

import Modal from '~/components/modals/Modal'
import { getMilestoneById } from '~/models/milestone.server';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import MilestoneForm from '~/components/forms/milestones/MilestoneForm';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';

import type { Milestone } from '@prisma/client';
import type { LoaderArgs } from '@remix-run/node';
import type { MilestoneWithStrDates } from '~/types/milestoneTypes';

export const loader = async ({ request, params }: LoaderArgs) => {

  const milestoneId = params.milestoneId
  if (!milestoneId) throw new Error('No milestoneId was provided')
  try {
    const milestone = await getMilestoneById(milestoneId)
    return { milestone }
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
        <div className='w-[650px] min-w-[250px] border-2 border-blue-600'>
          <MilestoneForm milestone={milestone} isNew={false} />
        </div>
      </Modal>
    </>
  )
}

export default EditMilestonePage


export const useGetMilestone = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const loadedMilestoneWithStrDates: MilestoneWithStrDates = loaderData.milestone;
  const [milestone, setMilestone] = useState<Milestone>();

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