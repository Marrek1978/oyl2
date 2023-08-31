import type { Desire, Project } from '@prisma/client'

import H1WithLink from '~/components/titles/H1WithLink';
import H2WithProsePara from '~/components/text/H2WithProsePara';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import ProjectAllDesiredOutcomes from '~/components/projects/ProjectAllDesiredOutcomes';
import H2WithLinkAndProsePara from '../text/H2WithLinkAndProsePara';
import H2WithLink from '../titles/H2WithLink';


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

            <div className='text-base-content'>
              <div className='mt-8 '>
                <div className='text-success mb-2'>
                  <SubHeading16px text='The Desire' />
                </div>
                <div className='flex flex-wrap gap-12 max-w-max '>
                  <div className='flex-1 min-w-[300px]'>
                    <H2WithLinkAndProsePara
                      title={desire?.title}
                      linkDestination={`/dash/desires/${desire?.id}`}
                      linkText='Go to Desire'
                      paragraph={desire?.description || ''}
                      isTextBtn={true}
                    />
                  </div>

                  <div className='flex-1 max-w-max min-w-[300px]'>
                    <H2WithProsePara
                      title={'The Ideal Scenario'}
                      paragraph={desire?.ideal?.length ? desire?.ideal : DesireIdealPlaceholderText}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-12'>
              <ProjectAllDesiredOutcomes
                desire={desire}
              />
            </div>
          </>

        ) : (<>
          <div className='mt-8'>
            <H2WithLink
              title={'Each Project must be associated with a Desire \n Please Edit the Project to Add a Desire'}
              linkDestination={`/dash/projects/${project.id}/edit`}
              linkText='Edit Project to Associate a Desire'
              isTextBtn={false}
              daisyUIColor='primary'
            />
          </div>
        </>
        )}

      </BasicTextAreaBG >
    </>
  )
}

export default ProjectDisplay