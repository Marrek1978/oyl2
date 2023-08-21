import { Link } from '@remix-run/react';
import type { Desire, Project } from '@prisma/client'

import HeadingH1 from '../titles/HeadingH1';
import SubHeading16px from '../titles/SubHeading16px';
import SubHeading14px from '../titles/SubHeading14px';
import BasicTextAreaBG from '../baseContainers/BasicTextAreaBG';
import ProjectAllDesiredOutcomes from './ProjectAllDesiredOutcomes';
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara';
import { DesireIdealPlaceholderText } from '../utilities/PlaceHolderTexts';


interface ProjectDisplayProps {
  project: Project;
  desire: Desire;
}

function ProjectDisplay({ project, desire }: ProjectDisplayProps) {
  return (
    <>

      <BasicTextAreaBG >

        <div className='text-success mb-2'>
          <SubHeading16px text='Project' />
        </div>

        {/* //?  THE TITLE SECTION  */}
        <HeadingH1 text={project.title || ''} />

        <div className=" flex flex-wrap mt-2 text-secondary/70">
          <SubHeading14px
            text={`To achieve your Desire for : ` + desire.title}
          />
        </div>

        <div className='flex flex-wrap gap-12 w-full '>

          {/* //*  Grouped together  */}
          <div className='flex-1'>

            <div className='text-base-content'>
              {/* //?  THE DESIRE  */}
              <div className='mt-8 '>
                {/* <HeadingH2 text={desire.title} /> */}
                <H2WithLinkAndProsePara
                  title={'The Desire'}
                  linkDestination={'/dash/desires/' + desire.id}
                  linkText={'Go To Desire'}
                  paragraph={desire.description || ''}
                />
              </div>
            </div>

            <div id='links' className='mt-8'>
              <ul>
                <li> <Link to='..'>All Project Milestones</Link></li>
                <li> <Link to='..'>All Project Lists and Routines</Link></li>
                <li> <Link to='..'>All Project Habit Trackers</Link></li>
                <li><Link to='..'>All Project Money Trackers</Link></li>
              </ul>
            </div>
          </div>

          <div className=' mt-8 flex-1 '>
            <H2WithLinkAndProsePara
              title={'The Ideal Scenario'}
              linkDestination={'editIdeal'}
              linkText={'Edit Ideal Scenario'}
              paragraph={desire.ideal?.length ? desire.ideal : DesireIdealPlaceholderText}
            />
          </div>
        </div>

        <div className='mt-12'>
          <ProjectAllDesiredOutcomes />
        </div>



      </BasicTextAreaBG >

    </>
  )
}

export default ProjectDisplay