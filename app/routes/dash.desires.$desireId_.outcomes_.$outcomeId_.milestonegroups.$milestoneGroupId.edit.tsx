import React from 'react'
import Modal from '~/components/modals/Modal'
import MilestoneGroupForm from '~/components/forms/milestones/MilestoneGroupForm'
import { useRouteLoaderData } from '@remix-run/react';

function EditMilestoneGroupPage() {

  const path = 'app/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId'
  const loaderData = useRouteLoaderData(path);
  console.log('EditMilestoneGroupPage')
  console.log('loaderData', loaderData)


  return (
    <Modal zIndex={40} >

      <MilestoneGroupForm
        isNew={false}
      />
    </Modal>
  )
}

export default EditMilestoneGroupPage