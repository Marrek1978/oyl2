import Heading16px from '../headers/Heading16px';
import SubHeading12px from '../headers/SubHeading12px';
import DraggableListItem from './DraggableListItem';
import { v4 as uuidv4 } from 'uuid';


import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks } from '~/types/routineTypes';

type Props = {
  handleDragStart: (event: any) => void;
  listsArray: ListAndToDos[] | undefined;
  routinesArray: RoutineAndTasks[] | undefined;
  isAllListsBlock?: boolean;
}

function DraggableListsOrRoutines({ handleDragStart, listsArray, routinesArray, isAllListsBlock = false }: Props) {
  const hasLists = listsArray && listsArray.length > 0
  const hasRoutines = routinesArray && routinesArray.length > 0

  const miscListsObj = {
    id: uuidv4(),
    title: 'All Misc. Lists',
    name: 'allMiscLists',
    description: 'Auto-Loads All Misc Lists',
    lists: listsArray
  }


  const routineStyle = `misc-draggable-routine`
  const listStyle = `misc-draggable-list`

  return (
    <>

      <div className='flex gap-4'>
        <div className='w-56'>
          <div className='my-4'>
            <Heading16px text={'Routines'} />
          </div>

          {hasRoutines ?
            routinesArray?.map(routine => (
              <DraggableListItem
                key={routine.id}
                list={routine}
                handleDragStart={handleDragStart}
                style={routineStyle}
              />
            )) : (<div className='text-sm'>No Routines Found</div>)}
        </div>

        <div className='w-56'>
          <div className='my-4'>
            <Heading16px text={'Lists'} />
          </div>


          {(hasLists && isAllListsBlock) && (
            <div
              className={`all-misc-lists-draggable scheduler-draggableLists-common `}
              draggable="true"
              onDragStart={() => handleDragStart(miscListsObj)}
            >
              <SubHeading12px text={'All Misc. Lists'} />
              <div className='text-sm'> (Auto loads All Lists)</div>
            </div>

          )}

          {hasLists ?
            listsArray?.map(list => (
              <DraggableListItem
                key={list.id}
                list={list}
                handleDragStart={handleDragStart}
                style={listStyle}
              />
            )) : (<div className='text-sm'>No Lists Found</div>)}
        </div>
      </div>
    </>
  )
}

export default DraggableListsOrRoutines