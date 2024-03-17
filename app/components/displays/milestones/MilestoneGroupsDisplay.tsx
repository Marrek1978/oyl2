import React from 'react'
import type { MilestoneGroupsWithMilestones } from '~/types/milestoneTypes'
import TextProseWidth from '../../text/TextProseWidth'
import H2WithLink from '../../headers/H2WithLink'


interface Props {
  milestoneGroups: MilestoneGroupsWithMilestones[]

}


function MilestoneGroupsDisplay({ milestoneGroups }: Props) {

  return (
    <div className='mt-4'>
      {milestoneGroups?.map((group, index) => {

        const milestones = group?.milestones || []
        milestones.sort((a, b) => a.sortOrder - b.sortOrder)

        const isMilestones = group?.milestones.length > 0

        return (
          <div key={group.id} className={`${index > 0 && 'mt-8'}`}>
            <div className='max-w-max'>
              <H2WithLink
                h2Text={group.title}
                linkDestination={`milestonegroups/${group.id}`}
                linkText={'Go To'}
                btnColorDaisyUI={'link'}
              />
            </div>

            {isMilestones ? (
              <>
                <div className="mt-4">
                  <ul className={`steps my-steps `}>
                    {milestones.map((milestone) => {
                      const completed = milestone.isComplete ? 'step-primary' : ''
                      const label = milestone.title
                      return (
                        <li key={milestone.id} className={`step ${completed} whitespace-nowrap max-w-[100px]  min-w-[100px] text-xs text-ellipsis px-2`}>
                          {label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="mt-1">
                  <TextProseWidth
                    text={group.description || ''}
                  />
                </div>
              </>
            )
            }
          </div>
        )
      })}
    </div>
  )
}


export default MilestoneGroupsDisplay



