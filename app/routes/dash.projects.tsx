import {json, type ActionArgs, type LoaderArgs } from '@remix-run/server-runtime';
import { Outlet } from '@remix-run/react';
import { requireUserId } from '~/models/session.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { getProjects, updateProjectsOrder } from '~/models/project.server';
import DndProjects from '~/components/dnds/projects/DndProjects';
import { getDesires } from '~/models/desires.server';
import { parse } from 'querystring';

export const loader = async ({ request }: LoaderArgs) => {
  let userId;
  userId = await requireUserId(request);
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
    return json({status:'success'}, {status: 200})
  } catch (error) { throw error }
}

//list of dnd projects, dnd to order priority



export default function AllProjectsPage() {

  return (
    <>
      <section className='flex gap-8'>
        <div className=' flex-1  max-w-max'>
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
