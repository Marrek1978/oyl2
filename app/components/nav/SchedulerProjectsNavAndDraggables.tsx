import { NavLink } from '@remix-run/react'
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'


type Props = {
  projectsWithListsAndRoutines: ProjectWithListsAndRoutines[]
}

function SchedulerProjectsNavAndDraggables({ projectsWithListsAndRoutines }: Props) {

  const projects: ProjectWithListsAndRoutines[] = projectsWithListsAndRoutines
  // console.log('projecsts are ', projects)

  return (
    <>
      <nav >
        <ul id='side-nav2' className="menu w-56 p-0 [&_li>*]:rounded-none">


// ! make into buttons
//! sortOrder = 0 ==> special styles 
//! hover, active styles 
//!  state to open 2nd menu 

//!  styles for2nd menu, different again for sortOrder = 0
          {projects.map((project, index) => (

            <li key={project.id} className="">
              <NavLink to={``} end >
                <span>{project.title}</span>
                
              </NavLink>
            </li>
          ))}

          <li className="">
            <NavLink to='/dashboard/focus/daily/priorities/projects' end >
              <span>Today</span>
            </NavLink>
          </li>

          <li className="">
            <NavLink to='/dash/schedule' end >
              <span>Schedule</span>
            </NavLink>
          </li>



          <li className="">
            <NavLink to='/dash/alllists' >
              <span>Lists & Routines</span>
            </NavLink>
          </li>

        </ul>
      </nav>
    </>
  )
}

export default SchedulerProjectsNavAndDraggables