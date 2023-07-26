import type { Project } from '@prisma/client'
import { Link, Outlet, useMatches, useParams } from '@remix-run/react'
import type { LoaderArgs, ActionArgs } from '@remix-run/server-runtime'
import React from 'react'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import HeadingH1 from '~/components/titles/HeadingH1'
import { Desire } from '@prisma/client';
import TextBtn from '~/components/buttons/TextBtn'
import { EditIcon } from '~/components/utilities/icons'


export const loader = async ({ request }: LoaderArgs) => {

  //load project from params
  return null
}

export const action = async ({ request }: ActionArgs) => {
  return null
}

//edit projecdt fields
// add lists, routines, routine_tracker, and required_savings, associated to project.
// nested lists will be available to schedule, routines will be available to schedule,
//  routine_tracker will not be available to schedule, required_savings will not be available to schedule
export default function ProjectByIdPage() {

  const matches = useMatches();
  const params = useParams();
  const projects = matches.find(match => match.id === 'routes/dash.projects')?.data.projects
  const desires = matches.find(match => match.id === 'routes/dash.projects')?.data.desires
  const project = projects?.find((project: Project) => project.id === params.projectId)

  const desireTitle = desires.find((desire: Desire) => desire.id === project.desireId)?.title

  return (
    <>
      <Outlet />
      <div className='flex flex-col gap-6'>

        <article>
          <BasicTextAreaBG >
            <div className='flex justify-between items-baseline'>

              <div className='flex gap-4 items-baseline '>
                <HeadingH1 text={project.title} />
                {desireTitle && (
                  <div className="badge badge-sm badge-info gap-2 ">
                    {desireTitle}
                  </div>
                )}
              </div>
              <Link to={'edit'} >
                <TextBtn
                  text='Edit Project Details'
                  onClickFunction={() => { }}
                  icon={EditIcon}
                />
              </Link>

            </div>
            <p className='text-xl' >{project.description}</p>


          </BasicTextAreaBG >
        </article>

        <article>
          <BasicTextAreaBG >
            Lists
            Habits
            habit tracker
            required savings
          </BasicTextAreaBG >
        </article>
      </div>

    </>
  )
}
