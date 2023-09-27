import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useMatches, useNavigate, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BasicTextAreaBG from "~/components/baseContainers/BasicTextAreaBG";
import MilestoneGroupForm from "~/components/forms/milestones/MilestoneGroupForm"
import DndGenericContext from "~/components/dnds/DndGenericContext";
import { getMilestoneGroupsByOutcomeId, createMilestoneGroup, updateGroupsOrder } from '~/models/milestoneGroup.server';

import type { MilestoneGroup } from "@prisma/client";
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';
import type { MilestoneGroupsWithStrDates } from "~/types/milestoneTypes";


export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUserId(request);
  const { outcomeId } = params;
  if (!outcomeId) return redirect('/dash')

  try {
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return redirect('/dash/desires')
    const allMilestoneGroupsByOutcome = await getMilestoneGroupsByOutcomeId(outcomeId);
    return { allMilestoneGroupsByOutcome }
  } catch (error) { throw error }
};


export const action = async ({ request, params }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const groups = JSON.parse(parsedBody.itemsString as string);

    try {
      await updateGroupsOrder(groups)
      return 'Milestone Groups order was updated'
    } catch (error) { throw error }
  }

  const formData = await request.formData()
  const groupsData = Object.fromEntries(formData);

  let group = {
    title: groupsData.title as string,
    description: groupsData.description as string,
    sortOrder: groupsData.sortOrder ? parseInt(groupsData.sortOrder as string) : 0,
    outcomeId: params.outcomeId as string,
  }

  try {
    await createMilestoneGroup(group);
    return 'success'
  } catch (error) { throw error }


  return null

}


function MilestoneGroupsPage() {

  const [groups, setGroups] = useState<MilestoneGroup[]>([]);
  const loadedGroups: MilestoneGroup[] | undefined = useGetAllMilestoneGroupsForOutcome()

  useEffect(() => {
    if (!loadedGroups) return
    setGroups(loadedGroups)
  }, [loadedGroups])


  return (
    <>
      <Outlet />
      <article className="flex gap-12 flex-wrap ">

        <section className='flex-1 max-w-max  '>
          <div className={`w-full min-w-[350px]`} >
            <BasicTextAreaBG  >
              <DndGenericContext<MilestoneGroup>
                passedArray={groups}
                dndTitle={'Milestone Groups'}
              />
            </BasicTextAreaBG>
          </div >
        </section>

        <section className='flex-1 '>
          <MilestoneGroupForm />
        </section>

      </article>
    </>
  )
}

export default MilestoneGroupsPage


export const useGetAllMilestoneGroupsForOutcome = (): MilestoneGroup[] | undefined => {

  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [groups, setGroups] = useState<MilestoneGroup[]>();

  useEffect(() => {
    const groupsWithStrDates: MilestoneGroupsWithStrDates[] = loaderData?.allMilestoneGroupsByOutcome;
    const groupsWithProperDates: MilestoneGroup[] = transformGroupDates(groupsWithStrDates);
    setGroups(groupsWithProperDates);
  }, [loaderData, navigate]);

  return groups;
};




// export const useGetSpecificMilestoneGroupsById = (groupId: string): MilestoneGroup | undefined => {

//   const allGroups = useGetAllMilestoneGroupsForOutcome();
//   const [group, setGroup] = useState<MilestoneGroup>();

//   useEffect(() => {
//     const specificGroup = allGroups?.find((group) => group.id === groupId)
//     setGroup(specificGroup);
//   }, [allGroups, groupId]);

//   return group;
// };



function transformGroupDates(items: MilestoneGroupsWithStrDates[]): MilestoneGroup[] {

  return items?.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt!),
    updatedAt: new Date(item.updatedAt!),
  }));
}
