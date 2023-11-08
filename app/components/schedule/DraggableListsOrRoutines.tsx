import Heading16px from '../titles/Heading16px';
import DraggableListItem from './DraggableListItem';

import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks } from '~/types/routineTypes';

type Props = {
  handleDragStart: (event: any) => void;
  listsArray: ListAndToDos[] | undefined;
  routinesArray: RoutineAndTasks[] | undefined;
}

function DraggableListsOrRoutines({ handleDragStart, listsArray, routinesArray }: Props) {
  const hasLists = listsArray && listsArray.length > 0
  const hasRoutines = routinesArray && routinesArray.length > 0


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