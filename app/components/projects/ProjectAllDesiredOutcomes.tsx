import { Link, useLoaderData } from '@remix-run/react'

import { useEffect, useState } from 'react'
import H1WithLink from '~/components/titles/H1WithLink'
import SubHeading14px from '~/components/titles/SubHeading14px'
import ProjectSpecficOutcome from '~/components/projects/ProjectSpecficOutcome'

import type { DesireOutcomeWithStringDates } from '~/types/outcomeTypes'
import HeadingH1 from '../titles/HeadingH1'
import SmlBtn from '../buttons/SmlBtn'

type Props = {}

function ProjectAllDesiredOutcomes({ }: Props) {

  const { outcomes } = useLoaderData()
  const [isOutcomes, setIsOutcomes] = useState<boolean>()

  useEffect(() => {
    setIsOutcomes(outcomes.length > 0 ? true : false)
  }, [outcomes])


  return (
    <>
      <div className='max-w-max t-20'>
        {isOutcomes ? (
          <>
            <div className='flex gap-12 justify-between items-center w-full'>
              <HeadingH1
                text={'Tasks to Reach Desired Outcomes'}
              />
              <Link to={`/dash/desires/${outcomes[0].desireId}/outcomes`}>
                <SmlBtn
                  linkText='Go To Desire -> Outcomes'
                  size='xs'
                />
              </Link>
            </div>
          </>
        ) : (
          <H1WithLink
            title={'Desires must have Outcomes for Tasks'}
            linkDestination={`/dash/desires`}
            linkText='Go To Desire to Add Outcomes'
            isTextBtn={false}
            daisyUIColor='primary'
          />

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
                <ProjectSpecficOutcome
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