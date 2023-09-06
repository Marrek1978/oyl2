import SubHeading12px from '../titles/SubHeading12px';

import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'

type Props = {
  projects: ProjectWithListsAndRoutines[];
  handleProjectSelectionClick: (id: string) => void;
  selectedProject: ProjectWithListsAndRoutines | undefined
}

function ProjectsList({ projects, handleProjectSelectionClick, selectedProject }: Props) {


  return (
    <>
      <div className="menu w-56 p-0 [&_li>*]:rounded-none">

        {projects?.map((project, index) =>
          project.sortOrder === 0 ? (
            <div key={project.id}
              className={`scheduler-projectsList 
                border-2 border-success 
                ${project?.id === selectedProject?.id ? 'bg-base-100' : ''}
              `}
              onClick={() => handleProjectSelectionClick(project.id)}
            >
              <div className='p-0 block hover:bg-base-100'>
                <div className='text-success font-bold'>
                  <SubHeading12px text={'Main Focus'} />
                </div>
                <div className='  '>
                  {project.title}
                </div>
              </div>
            </div>
          ) : (
            <div key={project.id}
              className={`scheduler-projectsList 
                ${project?.id === selectedProject?.id ? 'bg-base-100' : ''} 
              `}
              onClick={() => handleProjectSelectionClick(project.id)}
            >
              {project.title}
            </div>
          )
        )}

      </div>
    </>
  )
}

export default ProjectsList