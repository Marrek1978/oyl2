import { parse } from 'querystring';
import { Outlet } from '@remix-run/react';
import { type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';

import { getDesires } from '~/models/desires.server';
import { requireUserId } from '~/models/session.server';
import DndProjects from '~/components/dnds/projects/DndProjects';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { getProjects, updateProjectsOrder } from '~/models/project.server';

export const loader = async ({ request }: LoaderArgs) => {
  let userId = await requireUserId(request);
  try {
    const desires = await getDesires(userId)
    const projects = await getProjects(userId)
    return { projects, desires, userId }
  } catch (error) { throw error }
}

export const action = async ({ request }: ActionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  const projects = JSON.parse(parsedBody.projectString as string);
  try {
    await updateProjectsOrder(projects)
    return 'Projects order was updated'
  } catch (error) {
    return 'There was an issue updating the sorting order'
  }
}

export default function AllProjectsPage() {

  return (
    <>
      <BreadCrumbs  title=''  />
      <section className='flex gap-8'>
        <div className=' flex-1 max-w-max'>
          <BasicTextAreaBG >
            <DndProjects />
          </BasicTextAreaBG >
        </div>
        <div className='flex-1  max-w-[800px]'>
          <Outlet />
        </div>
      </section >
    </>
  )
}
