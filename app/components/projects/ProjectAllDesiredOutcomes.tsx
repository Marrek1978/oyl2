import { useEffect, useState } from 'react'
import { useLoaderData } from '@remix-run/react'

import H2WithLink from '../titles/H2WithLink'
import SubHeading14px from '~/components/titles/SubHeading14px'
import ProjectTasksForOutcomeDisplayAll from '~/components/projects/ProjectTasksForOutcomeDisplayAll'

import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'

type Props = {}

function ProjectAllDesiredOutcomes({ }: Props) {

  const { outcomes } = useLoaderData()
  const [isOutcomes, setIsOutcomes] = useState<boolean>()

  useEffect(() => {
    setIsOutcomes(outcomes.length > 0 ? true : false)
    console.log('outcomes', outcomes)
  }, [outcomes])


  return (
    <>
      <div className='max-w-max t-20'>
        {isOutcomes ? (
          <>
            <div className=' '>
              {/* <div className='flex gap-12 justify-between items-center w-full'> */}
              <H2WithLink
                title={'Desired Outcomes and their Tasks'}
                linkDestination={`/dash/desires/${outcomes[0]?.desireId}/outcomes`}
                linkText='Go To Desired Outcomes'
                daisyUIColor='primary'
              />
            </div>
          </>
        ) : (
          <>
            <H2WithLink
              title={'Desires must have Outcomes for Tasks'}
              linkDestination={`/dash/desires`}
              linkText='Go To Desire to Add Outcomes'
              isTextBtn={false}
              daisyUIColor='primary' />
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