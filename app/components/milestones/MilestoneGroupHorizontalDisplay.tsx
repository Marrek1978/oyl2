import { Link } from '@remix-run/react'

import FormButtons from '../forms/FormButtons'
import BtnWithProps from '../buttons/BtnWithProps'
import DndMilestones from '../dnds/milestones/DndMilestones'
import BasicFormAreaBG from '../forms/BasicFormAreaBG'

import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes'

type Props = {
  milestoneGroup: MilestoneGroupsWithMilestones
}

function MilestoneGroupHorizontalDisplay({ milestoneGroup }: Props) {

  const milestones = milestoneGroup?.milestones || []
  const header = (<>
    <span className='text-sm mr-1' >Milestone Group:</span> {milestoneGroup.title}



  </>)

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
        <div className='m-8  flex flex-col gap-8 overflow-hidden  '>
          {/* <div className='flex gap-x-2'>
            <div className='text-base-content/70'>
              <SubHeading14px text='For Outcome: ' />
            </div>
            <div className='text-secondary'>
              <SubHeading14px text='The thing ' />
            </div>
          </div> */}

          {milestoneGroup?.description && (
            <div>
              <p>
                {milestoneGroup?.description}
              </p>
            </div>
          )}

          <DndMilestones milestones={milestones} />

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