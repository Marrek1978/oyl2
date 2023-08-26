import type { Desire, Project } from '@prisma/client'

import HeadingH2 from '../titles/HeadingH2';
import H2WithLink from '../titles/H2WithLink';
import H1WithLink from '~/components/titles/H1WithLink';
import H2WithProsePara from '~/components/text/H2WithProsePara';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import ProjectAllDesiredOutcomes from '~/components/projects/ProjectAllDesiredOutcomes';


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
        <div className='max-w-max'>
          <H1WithLink
            title={project.title}
            linkDestination={`/dash/projects/${project.id}/edit`}
            linkText='Edit Project Name or Associated Desire'

            isTextBtn={true}
            daisyUIColor='primary'
          />
        </div>

        {desire ? (
          <>
            <div className=" flex flex-wrap mt-2 text-secondary/70">
              <SubHeading14px
                text={`To achieve your Desire for : ` + desire.title}
              />
            </div>

            <div className='flex flex-wrap gap-12 max-w-max '>
              <div className='flex-1'>
                <div className='text-base-content'>
                  <div className='mt-8 '>
                    <H2WithLink
                      title={'The Desire:'}
                      linkDestination={`/dash/desires/${desire?.id}`}
                      linkText='Go to Desire'
                      isTextBtn={true}
                      daisyUIColor='primary'
                    />
                    <H2WithProsePara
                      title={desire?.title}
                      paragraph={desire?.description || ''}
                    />
                   
                  </div>
                </div>
              </div>

              <div className=' mt-8 flex-1 max-w-max'>
                <H2WithProsePara
                  title={'The Ideal Scenario'}
                  paragraph={desire?.ideal?.length ? desire?.ideal : DesireIdealPlaceholderText}
                />
              </div>
            </div>

            <div className='mt-12'>
              <ProjectAllDesiredOutcomes />
            </div>
          </>

        ) : (<>
          <div className='mt-8'>
            <HeadingH2 text='Each Project must be associated with a Desire - Please Edit the Project to Add a Desire' />
          </div>
        </>
        )}

      </BasicTextAreaBG >
    </>
  )
}

export default ProjectDisplay