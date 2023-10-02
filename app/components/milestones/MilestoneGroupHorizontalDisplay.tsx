import React from 'react'
import FormButtons from '../forms/FormButtons'
import BtnWithProps from '../buttons/BtnWithProps'
import { Link } from '@remix-run/react'
import DndMilestones from '../dnds/milestones/DndMilestones'
import BasicFormAreaBG from '../forms/BasicFormAreaBG'
import type { MilestoneGroup } from '@prisma/client'

type Props = {
  milestoneGroup: MilestoneGroup
}

function MilestoneGroupHorizontalDisplay({ milestoneGroup }: Props) {

  const header = (<> <span className='text-sm mr-1' >Milestone Group:</span> {milestoneGroup.title}  </>)

  return (
    <>
      <BasicFormAreaBG
        h2Text={header}
        maxWidth='1200px'
        linkDestination='edit'
        linkText='Edit'
        btnColorDaisyUI='link'
        linkColorDaisyUI='info'
      >
        <div className='m-8 flex flex-col gap-8'>

          {milestoneGroup?.description && (
            <div>
              <p>
                {milestoneGroup?.description}
              </p>
            </div>
          )}

          <DndMilestones />

          <div className='w-full flex justify-center'>
            <Link to='newMilestone '>
              <BtnWithProps
                btnPurpose={'save'}
                daisyUIBtnColor='link'
                icon=' '
                btnLabel='Add Milestone'
                fontWidthTW='bold'
              />
            </Link>
          </div>

          <FormButtons
            isShowSaveBtn={false}
            isShowDeleteBtn={false}
            closeBtnText='Close'
          />
        </div>
      </BasicFormAreaBG >
    </>
  )
}

export default MilestoneGroupHorizontalDisplay