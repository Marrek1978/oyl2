import { parse } from 'querystring';
import { redirect } from "@remix-run/node";
import { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getMilestoneGroupById } from '~/models/milestoneGroup.server';
import DndMilestones from '~/components/dnds/milestones/DndMilestones';
import MilestoneForm from '~/components/forms/milestones/MilestoneForm';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';
import { createMilestone, getMilestonesByMilestoneGroupId, updateMilestonesOrder } from '~/models/milestone.server';

import type { Milestone } from '@prisma/client';
import type { CreateMilestone, MilestoneWithStrDates } from '~/types/milestoneTypes';

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request);
  const { milestoneGroupId } = params;
  if (!milestoneGroupId) return redirect('/dash')

  try {
    const group = await getMilestoneGroupById(milestoneGroupId);
    if (!group) return redirect('/dash/desires')
    const allMilestonesByGroup = await getMilestonesByMilestoneGroupId(milestoneGroupId);
    return allMilestonesByGroup
  } catch (error) { throw error }
}


export const action = async ({ request, params }: ActionArgs) => {

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

  //new milestone
  const formData = await request.formData()
  const milestoneData = Object.fromEntries(formData);

  const completedAt = formData.get('completedAt');
  const dueDate = formData.get('dueDate');

  let milestone: CreateMilestone = {
    title: milestoneData.title as string,
    description: milestoneData.description as string,
    sortOrder: milestoneData.sortOrder ? parseInt(milestoneData.sortOrder as string) : 0,
    milestoneGroupId: params.milestoneGroupId as string,
    isComplete: Boolean(milestoneData.iscomplete),
    completedAt: completedAt ? new Date(completedAt.toString()) : null,
    dueDate: dueDate ? new Date(dueDate.toString()) : null
  }

  try {
    await createMilestone(milestone);
    return 'success'
  } catch (error) { throw error }
}


function MilestonesPage() {

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const loadedMilestones: Milestone[] | undefined = useGetAllMilestonesForGroup()

  useEffect(() => {
    if (!loadedMilestones) return
    setMilestones(loadedMilestones)
  }, [loadedMilestones])


  return (
    <>
      <Outlet />

      <article className="flex gap-12 flex-wrap w-full   ">

        <section className='flex-1 max-w-max  '>
          <div className={`w-full min-w-[350px]`} >
            <BasicTextAreaBG  >
              <DndMilestones
                passedArray={milestones}
                dndTitle={'Milestones'}
              />
            </BasicTextAreaBG>
          </div >
        </section>

        <section className='flex-1 '>
          <MilestoneForm />
        </section>

      </article>
    </>
  )
}

export default MilestonesPage


export const useGetAllMilestonesForGroup = (): Milestone[] | undefined => {

  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [milestones, setMilestones] = useState<Milestone[]>();

  useEffect(() => {
    const milestonesWithStrDates: MilestoneWithStrDates[] = loaderData;
    if (milestonesWithStrDates === undefined) return navigate('/dash/desires');
    const datekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
    const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: milestonesWithStrDates, dateKeys: datekeys });
    setMilestones(milestonesWithProperDates);
  }, [loaderData, navigate]);

  return milestones;


}


