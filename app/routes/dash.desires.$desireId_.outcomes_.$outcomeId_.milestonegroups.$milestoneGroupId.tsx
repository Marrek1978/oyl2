import { Link } from '@remix-run/react'
import React from 'react'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import SolidBtn from '~/components/buttons/SolidBtn'
import Modal from '~/components/modals/Modal'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime';



export const action = async ({ request, params }: ActionArgs) => {

  return null


}


function MilestoneGroupPage() {
  return (
    <>
      <Modal >
        <BasicTextAreaBG pageTitle='Milestone Group Title' >
          <div>
            Milestone Group Display
          </div>
          <div>Edit link</div>
          <div>horizontal dnd of milestones</div>
          <div>Display milestone on hover</div>
          <div>add milestone button</div>
          <Link to='milestones'>
            <SolidBtn text='Add Milestone' />
          </Link>

          <div>buttons - delete group or close</div>
        </BasicTextAreaBG >
      </Modal>

    </>
  )
}

export default MilestoneGroupPage