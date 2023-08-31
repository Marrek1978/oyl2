import { useEffect, useState } from 'react'
import { useLoaderData } from '@remix-run/react'

import H2WithLink from '../titles/H2WithLink'
import SubHeading14px from '~/components/titles/SubHeading14px'
import ProjectTasksForOutcomeDisplayAll from '~/components/projects/ProjectTasksForOutcomeDisplayAll'

import type { Desire } from '@prisma/client'
import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'


interface Props {
  desire?: Desire;
}

function ProjectAllDesiredOutcomes({ desire }: Props) {

  const { outcomes } = useLoaderData()
  const [isOutcomes, setIsOutcomes] = useState<boolean>()

  useEffect(() => {
    setIsOutcomes(outcomes.length > 0 ? true : false)
  }, [outcomes])


  return (
    <>
      <div className='mt-20'>
        {!isOutcomes && (
          <>
            <H2WithLink
              title={'Desires must have Specified Outcomes for Projects'}
              linkDestination={`/dash/desires/${desire?.id}`}
              linkText='Edit the Desire to Add Outcomes'
              isTextBtn={false}
              daisyUIColor='primary'
            />
          </>
        )}
      </div>


      <div>
        {outcomes.map((desiredOutcome: DesireOutcomeWithStringDates) => {
          return (
            //?DND these???
            <div key={desiredOutcome.id}>
              <div className='mt-12'>
                <div className='text-success'>
                  <SubHeading14px text='Desired Outcome' />
                </div>
                <ProjectTasksForOutcomeDisplayAll
                  desiredOutcome={desiredOutcome}
                  key={desiredOutcome.id}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ProjectAllDesiredOutcomes