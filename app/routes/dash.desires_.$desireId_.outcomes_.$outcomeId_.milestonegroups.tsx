import { parse } from "querystring";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Outlet, useRouteLoaderData } from "@remix-run/react";

import { requireUserId } from '~/models/session.server';
import { getOutcomeByOutcomeId } from '~/models/outcome.server';
import BreadCrumbs from "~/components/breadCrumbTrail/BreadCrumbs";
import DndAndFormFlex from "~/components/baseContainers/DndAndFormFlex";
import MilestoneGroupForm from "~/components/forms/milestones/MilestoneGroupForm"
import { ArrayOfObjectsStrToDates } from "~/components/utilities/helperFunctions";
import DndMilestoneGroups from "~/components/dnds/milestoneGroups/DndMilestoneGroups";
import { getMilestoneGroupsByOutcomeId, createMilestoneGroup, updateGroupsOrder } from '~/models/milestoneGroup.server';

import type { Milestone } from "@prisma/client";
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/server-runtime';
import type { MilestoneGroupsWithMilestones, MilestoneGroupsWithMilestonesWithStringDates } from "~/types/milestoneTypes";



export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const { outcomeId } = params;
  if (!outcomeId) return redirect('../..')

  try {
    const outcome = await getOutcomeByOutcomeId(outcomeId);
    if (!outcome) return null
    const loadedGroups = await getMilestoneGroupsByOutcomeId(outcomeId);
    return loadedGroups || null
  } catch (error) { throw error }
};


export const action = async ({ request, params }: ActionFunctionArgs) => {

  if (request.method === 'PUT') {
    const formBody = await request.text();
    const parsedBody = parse(formBody);
    const groupsObj = JSON.parse(parsedBody.toServerDataString as string);
    const groups = groupsObj.sortableArray
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
      <BreadCrumbs secondCrumb={'Desire'} title2={'Outcome'} />
      <Outlet />
      <DndAndFormFlex
        dnd={<DndMilestoneGroups groups={groups} />}
        form={<MilestoneGroupForm />}
      />
    </>
  )
}

export default MilestoneGroupsPage


export const useGetAllMilestoneGroupsForOutcome = (): MilestoneGroupsWithMilestones[] => {
  const path = "routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups"
  const loadedGroupsArray = useRouteLoaderData(path)
  const [groups, setGroups] = useState<MilestoneGroupsWithMilestones[]>([]);

  useEffect(() => {
    if (!loadedGroupsArray) return
    const groupsWithStrDates: MilestoneGroupsWithMilestonesWithStringDates[] = loadedGroupsArray;
    const groupWithProperDates = ArrayOfObjectsStrToDates({ items: groupsWithStrDates, dateKeys: ['createdAt', 'updatedAt'] })

    const milestonesDatekeys = ['createdAt', 'updatedAt', 'dueDate', 'completedAt'];
    groupWithProperDates.map((group) => {
      const groupMilestones = group.milestones
      const milestonesWithProperDates: Milestone[] = ArrayOfObjectsStrToDates({ items: groupMilestones, dateKeys: milestonesDatekeys });
      return group.milestones = milestonesWithProperDates
    })

    setGroups(groupWithProperDates)
  }, [loadedGroupsArray]);

  return groups;
};




