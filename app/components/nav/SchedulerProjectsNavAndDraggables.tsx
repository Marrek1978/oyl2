import { useEffect, useState } from 'react'

import SubHeading12px from '../titles/SubHeading12px'
import SubHeading14px from '../titles/SubHeading14px'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'


type Props = {
  projectsWithListsAndRoutines: ProjectWithListsAndRoutines[]
}


function SchedulerProjectsNavAndDraggables({ projectsWithListsAndRoutines }: Props) {

  // const [selectedProjectId, setSelectedProjectId] = useState('')
  const projects: ProjectWithListsAndRoutines[] = projectsWithListsAndRoutines
  const [specificProject, setSpecificProject] = useState<ProjectWithListsAndRoutines>()

  const [specificProjectLists, setSpecificiProjectLists] = useState<ListAndToDos[]>()
  const [specificProjectRoutines, setSpecificiProjectRoutines] = useState<RoutineAndToDos[]>()
  // console.log('projecsts are ', projects)


  useEffect(() => {
    const project = projects.find((project: ProjectWithListsAndRoutines) => project.sortOrder === 0)
    project && setSpecificProject(project)
    project?.lists && setSpecificiProjectLists(project.lists)
    project?.routines && setSpecificiProjectRoutines(project.routines)

  }, [projects])


  useEffect(() => {
    console.log('specificProject is ', specificProject)
  }, [specificProject])


  const handleProjectsNavClick = (id: string) => {
    console.log('id is ', id)
    // setSelectedProjectId(id)
    const project = projects.find((project: ProjectWithListsAndRoutines) => project.id === id)
    if (project) {
      setSpecificProject(project)
    }
  }



  return (
    <>
      <div className='flex gap-8'>

        {/* cliclable list of projects*/}
        <nav >
          <ul className="menu w-56 p-0 [&_li>*]:rounded-none">

            {/* //!  , active styles  */}

            {projects.map((project, index) =>
              project.sortOrder === 0 ? (
                <li key={project.id}
                  className='scheduler-projects-nav  border-2 border-success '
                  onClick={() => handleProjectsNavClick(project.id)}
                >
                  <div className='p-0 block hover:bg-base-100'>
                    <div className='text-success font-bold'>
                      <SubHeading12px text={'Main Focus'} />
                    </div>
                    <div className='  '>
                      {project.title}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={project.id}
                  className='scheduler-projects-nav '
                  onClick={() => handleProjectsNavClick(project.id)}
                >
                  {project.title}
                </li>
              )
            )}

          </ul>
        </nav>



        {/* Draggable list of project deliversagbles */}

        {specificProject && (

          <nav >
            <ul className="menu w-56 p-0 [&_li>*]:rounded-none text-left">


              {/* project time block */}

              <li key={specificProject.id}
                className='scheduler-projects-nav '
              >
                <SubHeading14px text={'Time Block for'} />
                {specificProject.title}
              </li>

              {/*  
               
               //!  , active styles 
               //!  state to open 2nd menu 
               
              //!  styles for2nd menu, different again for sortOrder = 0 */}

              {projects.map((project, index) =>
                project.sortOrder === 0 ? (
                  <li key={project.id}
                    className='scheduler-projects-nav  border-2 border-success '
                    onClick={() => handleProjectsNavClick(project.id)}
                  >
                    <div className='p-0 block hover:bg-base-100'>
                      <div className='text-success font-bold'>
                        <SubHeading12px text={'Main Focus'} />
                      </div>
                      <div className='  '>
                        {project.title}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={project.id}
                    className='scheduler-projects-nav '
                    onClick={() => handleProjectsNavClick(project.id)}
                  >
                    {project.title}
                  </li>
                )
              )}

            </ul>
          </nav>
        )}
      </div>
    </>
  )
}

export default SchedulerProjectsNavAndDraggables