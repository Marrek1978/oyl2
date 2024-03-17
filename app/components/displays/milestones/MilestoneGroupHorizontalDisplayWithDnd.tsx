import { Link } from '@remix-run/react'

import FormButtons from '../../buttons/FormButtons'
import BtnWithProps from '../../buttons/BtnWithProps'
import DndMilestones from '../../dnds/milestones/DndMilestones'
import BasicFormAreaBG from '../../forms/util/BasicFormAreaBG'

import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes'
import TextProseWidth from '../../text/TextProseWidth'

type Props = {
  milestoneGroup: MilestoneGroupsWithMilestones
}

function MilestoneGroupHorizontalDisplayWithDnd({ milestoneGroup }: Props) {

  const milestones = milestoneGroup?.milestones || []
  const header = (<>
    <span className='text-sm mr-1' >Milestone Group:</span> {milestoneGroup.title}
  </>)

  return (
    <>

      <BasicFormAreaBG
        h2Text={header}
        linkDestination='edit'
        linkText='Edit'
        btnColorDaisyUI='link'
        linkColorDaisyUI='info'
      >
        <div className='p-8 flex flex-col gap-8 overflow-hidden  '>

          {milestoneGroup?.description && (
            <TextProseWidth
              text={milestoneGroup?.description}
            />
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

export default MilestoneGroupHorizontalDisplayWithDnd