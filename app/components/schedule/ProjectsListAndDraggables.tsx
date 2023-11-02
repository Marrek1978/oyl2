import { useEffect, useState } from 'react'

import ProjectsList from './ProjectsList'
import SelectedProject from './SelectedProject'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'


type Props = {
  projectsWithListsAndRoutines: ProjectWithListsAndRoutines[]
  handleDragStart: (event: any) => void;
}


function ProjectsListAndDraggables({ projectsWithListsAndRoutines, handleDragStart }: Props) {

  const projects: ProjectWithListsAndRoutines[] = projectsWithListsAndRoutines

  const [isMainFocus, setIsMainFocus] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<ProjectWithListsAndRoutines>()
  const [selectedProjectLists, setSelectedProjectLists] = useState<ListAndToDos[]>()
  const [selectedProjectRoutines, setSelectedProjectRoutines] = useState<RoutineAndTasks[]>()


  // on initial load, set selectedProject to the project with sortOrder = 0
  useEffect(() => {
    if(!selectedProject){
      const project = projects.find((project: ProjectWithListsAndRoutines) => project.sortOrder === 0)
      project && setSelectedProject(project)
      project?.lists && setSelectedProjectLists(project.lists)
      project?.routines && setSelectedProjectRoutines(project.routines)
      setIsMainFocus(true)
    }
  }, [projects, selectedProject])


  useEffect(() => {
    // console.log('specificProject is ', selectedProject)
    // console.log('ismainfoucs ', isMainFocus)
  }, [selectedProject, isMainFocus])


  const handleProjectSelectionClick = (id: string) => {
    // console.log('id is ', id)
    // setSelectedProjectId(id)
    const project = projects.find((project: ProjectWithListsAndRoutines) => project.id === id)
    if (project) {
      setSelectedProject(project)
      project?.lists && setSelectedProjectLists(project.lists)
      project?.routines && setSelectedProjectRoutines(project.routines)
      setIsMainFocus(project.sortOrder === 0 ? true : false)
    }
  }



  return (
    <>
      <div className='flex gap-8'>

        <ProjectsList
          projects={projects}
          handleProjectSelectionClick={handleProjectSelectionClick}
          selectedProject={selectedProject}
        />

        {selectedProject && (
          <>
            <SelectedProject
              selectedProject={selectedProject}
              handleDragStart={handleDragStart}
              selectedProjectLists={selectedProjectLists}
              selectedProjectRoutines={selectedProjectRoutines}
              isMainFocus={isMainFocus}
            />
          </>
        )}

      </div>
    </>
  )
}

export default ProjectsListAndDraggables