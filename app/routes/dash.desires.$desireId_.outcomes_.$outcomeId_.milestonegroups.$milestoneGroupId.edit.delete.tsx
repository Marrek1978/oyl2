import { parse } from 'querystring';
import { redirect } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime';

import Modal from '~/components/modals/Modal'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import { deleteMilestoneGroupById, getMilestoneGroupById } from '~/models/milestoneGroup.server';
// import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';


// export const loader = async ({ request, params }: LoaderArgs) => {
//   const { milestoneGroupId } = params
//   if (!milestoneGroupId) return 'noId'
//   try {
//     const milestoneGroup = await getMilestoneGroupById(milestoneGroupId)
//     return milestoneGroup
//   } catch (error) { return 'noId' }
// }

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

  const loaderData = useLoaderData()
  const { milestoneGroupId } = useParams()
  // const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect(loaderData)


  return (
    <>
      <Modal
        onClose={() => { }}
        zIndex={50}
      >
        {/* {warning */}
          {/* ? ( */}
            {/* // <>{alertMessage}</> */}
          {/* ) : ( */}
            {/* < AreYouSureDeleteModal
              item={'Milestone Group'}
              title={loaderData?.title}
              id={milestoneGroupId || ''}
            /> */}
          {/* )} */}
      </Modal>
    </>
  )
}

export default DeleteMilestoneGroupPage


