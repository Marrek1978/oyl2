
import type { ProjectWithListsAndRoutines } from '~/types/projectTypes'
import DraggableListItem from './DraggableListItem';
import Heading16px from '../titles/Heading16px';
import SubHeading14px from '../titles/SubHeading14px';
import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndToDos } from '~/types/routineTypes';

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

        <div 
          key={selectedProject.id}
          className={`${timeBlockStyle} scheduler-draggableLists-common`}
          draggable="true"
          onDragStart={() => handleDragStart(selectedProject)}
        >
          <SubHeading14px text={'Time Block for'} />
          {selectedProject.title}
        </div>


        {selectedProjectRoutines && (
          <div className='my-4'>
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
          <div className='my-4'>
            <Heading16px text={'Lists'} />
          </div>
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