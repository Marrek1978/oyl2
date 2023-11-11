import { parse } from 'querystring';
import { useEffect, useState } from 'react'
import { useParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { deleteMilestoneById } from '~/models/milestone.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useGetMilestone } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.$milestoneId';


export const action = async ({ request }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const milestoneId = parsedBody.rowId as string
  try {
    await deleteMilestoneById(milestoneId)
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteMilestonePage() {

  const params = useParams()
  const { desireId, outcomeId, milestoneGroupId } = params

  const loadedGroup = useGetMilestone()
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')


  useEffect(() => {
    if (!loadedGroup) return
    setId(loadedGroup?.id)
    setTitle(loadedGroup?.title)
  }, [loadedGroup])

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}/milestonegroups/${milestoneGroupId}`, message: 'Milestone was deleted' })


  return (
    <>
      <Modal onClose={() => { }} zIndex={50}>
        <AreYouSureDeleteModal item={'Milestone'} title={title} id={id} />
      </Modal>
    </>
  )
}

export default DeleteMilestonePage


