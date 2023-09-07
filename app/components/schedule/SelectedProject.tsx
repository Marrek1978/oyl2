
import Heading16px from '../titles/Heading16px';
import DraggableListItem from './DraggableListItem';
import SubHeading12px from '../titles/SubHeading12px';

import type { RoutineAndToDos } from '~/types/routineTypes';
import type { ListAndToDos } from '~/types/listTypes';
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'

type Props = {
  selectedProject: ProjectWithListsAndRoutines;
  handleDragStart: (event: any) => void;
  selectedProjectLists: ListAndToDos[] | undefined;
  selectedProjectRoutines: RoutineAndToDos[] | undefined;
  isMainFocus: boolean;
}

function SelectedProject({ selectedProject, handleDragStart, selectedProjectLists, selectedProjectRoutines, isMainFocus }: Props) {

  const timeBlockStyle = isMainFocus ? 'projects-draggable-timeBlock-mainFocus' : 'projects-draggable-timeBlock-default'
  const style = isMainFocus ? 'project-draggable-mainfocus' : 'project-draggable-default'

  return (
    <>
      <div className=" w-56 p-0 [&_li>*]:rounded-none text-left ">

        {selectedProjectRoutines && (
          <div className='mb-4'>
            <Heading16px text={'Routines'} />
          </div>
        )}

        {selectedProjectRoutines?.map(routine => (
          <DraggableListItem
            key={routine.id}
            list={routine}
            handleDragStart={handleDragStart}
            style={style}

          />
        ))}


        {selectedProjectLists && (
          <>
            <div className='mt-6 mb-4'>
              <Heading16px text={'Lists'} />
            </div>

            <div
              key={selectedProject.id}
              className={`${timeBlockStyle} scheduler-draggableLists-common `}
              draggable="true"
              onDragStart={() => handleDragStart(selectedProject)}
            >
              <SubHeading12px text={'Time Block for'} />
              {selectedProject.title}
              <div className='text-sm'> (Auto loads All Lists)</div>
            </div>
          </>
        )}

        {selectedProjectLists?.map((list, index) => (
          <>
            <DraggableListItem
              key={list.id}
              list={list}
              handleDragStart={handleDragStart}
              style={style}
            />
          </>
        ))}

      </div>
    </>
  )
}

export default SelectedProject