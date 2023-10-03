import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import DndGenericContext from "~/components/dnds/DndGenericContext";
import BasicTextAreaBG from "~/components/baseContainers/BasicTextAreaBG";
import MilestoneGroupForm from "~/components/forms/milestones/MilestoneGroupForm"
import { ArrayOfObjectsStrToDates } from "~/components/utilities/helperFunctions";
import { getMilestoneGroupsByOutcomeId, createMilestoneGroup, updateGroupsOrder } from '~/models/milestoneGroup.server';

import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';
import type { MilestoneGroupsWithMilestones, MilestoneGroupsWithMilestonesWithStringDates } from "~/types/milestoneTypes";


//!!!!  TEHRE WAS SOMETIHNG WRONG WITH THAT URLMESSAGE FOR LOADING !!!
//!!!!  deal with there being no outcome Id or it is invalid !!!
//!!!!   ... a custome message for that, an alert, and a redirect to the outcomes page... cascading backwards until login



//? if the outcome Id is not Valid, then alert and go back
//? there do not need to be any groups at this point 
export const loader = async ({ request, params }: LoaderArgs) => {
  console.log('milestonesGroups loader')
  await requireUserId(request);
  const { outcomeId } = params;
  if (!outcomeId) return redirect('../..')

  try {
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return null
    const loadedGroups = await getMilestoneGroupsByOutcomeId(outcomeId);
    return loadedGroups
  } catch (error) { throw error }
};


export const action = async ({ request, params }: ActionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const groups = JSON.parse(parsedBody.itemsString as string);

    try {
      await updateGroupsOrder(groups)
      return 'success'
    } catch (error) { return 'failure' }
  }

  if (request.method === 'POST') {
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
    } catch (error) { return 'failure' }
  }

  return null
}


function MilestoneGroupsPage() {

  const loadedGroupsData = useGetAllMilestoneGroupsForOutcome()
  const [groups, setGroups] = useState<MilestoneGroupsWithMilestones[]>([]);

  useEffect(() => {
    if (!loadedGroupsData) return
    setGroups(loadedGroupsData);
  }, [loadedGroupsData])


  return (
    <>
      <Outlet />
      <article className="flex gap-12 flex-wrap ">

        <section className='flex-1 max-w-max  '>
          <div className={`w-full min-w-[350px]`} >
            <BasicTextAreaBG  >
              <DndGenericContext<MilestoneGroupsWithMilestones>
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


export const useGetAllMilestoneGroupsForOutcome = (): MilestoneGroupsWithMilestones[] | null | undefined => {
  const path = "routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups"
  const loadedGroupsArray = useRouteLoaderData(path)
  const [groups, setGroups] = useState<MilestoneGroupsWithMilestones[]>();

  useEffect(() => {
    if (!loadedGroupsArray) return
    const groupsWithStrDates: MilestoneGroupsWithMilestonesWithStringDates[] = loadedGroupsArray;
    const groupsWithProperDates: MilestoneGroupsWithMilestones[] = ArrayOfObjectsStrToDates({ items: groupsWithStrDates, dateKeys: ['createdAt', 'updatedAt'] })
    setGroups(groupsWithProperDates);
  }, [loadedGroupsArray]);

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



// function transformGroupDates(items: MilestoneGroupsWithStrDates[]): MilestoneGroup[] {

//   return items?.map((item: any) => ({
//     ...item,
//     createdAt: new Date(item.createdAt!),
//     updatedAt: new Date(item.updatedAt!),
//   }));
// }
