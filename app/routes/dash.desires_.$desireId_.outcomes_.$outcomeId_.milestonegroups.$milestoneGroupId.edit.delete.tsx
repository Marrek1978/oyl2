import { parse } from 'querystring';
import { useEffect, useState } from 'react';
import { useParams } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteMilestoneGroupById } from '~/models/milestoneGroup.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast';
import { useGetMilestoneGroup } from './dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.edit';


export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const id = parsedBody.rowId as string
  try {
    await deleteMilestoneGroupById(id)
    return 'deleted'
  } catch (error) { return 'failed' }
}


function DeleteMilestoneGroupPage() {

  const params = useParams()
  const { desireId, outcomeId } = params
  const [id, setId] = useState<string>('')
  const loadedGroup = useGetMilestoneGroup()
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    if (!loadedGroup) return
    setId(loadedGroup?.id)
    setTitle(loadedGroup?.title)
  }, [loadedGroup])

  useFormDeletedToastAndRedirect({ redirectTo: `/dash/desires/${desireId}/outcomes/${outcomeId}`, message: 'MilestoneGroup was deleted' })


  return (
    <>
      <Modal
        onClose={() => { }}
        zIndex={50}
      >
        < AreYouSureDeleteModal
          item={'Milestone Group'}
          title={title}
          id={id}
        />
      </Modal>
    </>
  )
}

export default DeleteMilestoneGroupPage


