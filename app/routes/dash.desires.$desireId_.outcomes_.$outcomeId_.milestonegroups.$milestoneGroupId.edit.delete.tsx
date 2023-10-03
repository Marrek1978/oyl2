import { parse } from 'querystring';
import { redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import type { ActionArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import { deleteMilestoneGroupById } from '~/models/milestoneGroup.server';
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { useGetMilestoneGroup } from './dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId.edit';


export const action = async ({ request, params }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const id = parsedBody.rowId as string
  try {
    await deleteMilestoneGroupById(id)
    return redirect('../../..')
  } catch (error) { return 'failure' }
}


function DeleteMilestoneGroupPage() {

  const [id, setId] = useState<string>('')
  const loadedGroup = useGetMilestoneGroup()
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    if (!loadedGroup) return
    setId(loadedGroup?.id)
    setTitle(loadedGroup?.title)
  }, [loadedGroup])


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


