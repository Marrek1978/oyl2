import { parse } from 'querystring';
import { redirect } from '@remix-run/node'
import { useEffect, useState } from 'react'
import type { ActionArgs } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal'
import { deleteMilestoneById } from '~/models/milestone.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { useGetMilestone } from './dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.$milestoneId';


export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const milestoneId = parsedBody.rowId as string
  try {
    await deleteMilestoneById(milestoneId)
    return redirect('../..')
  } catch (error) { return 'failed' }
}


function DeleteMilestonePage() {

  const loadedGroup = useGetMilestone()
  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')


  useEffect(() => {
    if (!loadedGroup) return
    setId(loadedGroup?.id)
    setTitle(loadedGroup?.title)
  }, [loadedGroup])


  return (
    <>
      <Modal onClose={() => { }} zIndex={50}>
        <AreYouSureDeleteModal item={'Milestone'} title={title} id={id} />
      </Modal>
    </>
  )
}

export default DeleteMilestonePage


