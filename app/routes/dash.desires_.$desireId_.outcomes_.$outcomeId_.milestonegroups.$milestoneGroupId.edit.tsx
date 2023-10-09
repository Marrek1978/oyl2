import { parse } from 'querystring';
import { Outlet } from '@remix-run/react';
import { redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import type { LoaderArgs } from '@remix-run/node';

import Modal from '~/components/modals/Modal'
import { updateMilestoneGroupById } from '~/models/milestoneGroup.server';
import MilestoneGroupForm from '~/components/forms/milestones/MilestoneGroupForm'
import { useGetMilestoneGroupWithMilestones } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId';

import type { MilestoneGroup } from '@prisma/client';
import type { UpdateMilestoneGroup } from '~/types/milestoneTypes';


export const action = async ({ request, params }: LoaderArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const milestoneGroupData: UpdateMilestoneGroup = {
    id: parsedBody.rowId as string,
    title: parsedBody.title as string,
    description: parsedBody.description as string,
  }
  try {
    await updateMilestoneGroupById(milestoneGroupData)
    return redirect('..')
  } catch (error) { throw error }
}


function EditMilestoneGroupPage() {

  const loadedGroup = useGetMilestoneGroup()
  const [group, setGroup] = useState<MilestoneGroup | undefined>()

  useEffect(() => {
    if (!loadedGroup) return
    setGroup(loadedGroup)
  }, [loadedGroup])


  return (
    <>
      <Outlet />
      <Modal zIndex={40} >
        <div className='m-8 w-full'>
          <MilestoneGroupForm
            isNew={false}
            milestoneGroup={group}
          />
        </div>
      </Modal>
    </>
  )
}

export default EditMilestoneGroupPage

export const useGetMilestoneGroup = (): MilestoneGroup | null | undefined => {
  const loaderData = useGetMilestoneGroupWithMilestones()
  const [group, setGroup] = useState<MilestoneGroup | undefined>()

  useEffect(() => {
    if (!loaderData) return
    const { milestones, ...milestoneGroup } = loaderData
    setGroup(milestoneGroup as MilestoneGroup)
  }, [loaderData])

  return group
}