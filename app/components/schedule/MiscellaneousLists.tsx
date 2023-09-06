import Heading16px from '../titles/Heading16px';
import DraggableListItem from './DraggableListItem';

import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndToDos } from '~/types/routineTypes';

type Props = {
  handleDragStart: (event: any) => void;
  miscellaneousLists: ListAndToDos[] | undefined;
  miscellaneousRoutines: RoutineAndToDos[] | undefined;
}

function MiscellaneousLists({ handleDragStart, miscellaneousLists, miscellaneousRoutines }: Props) {

  const routineStyle = `misc-draggable-routine`
  const listStyle = `misc-draggable-list`

  return (
    <>

      <div className='flex gap-4'>
        <div className='w-56'>
          {miscellaneousRoutines && (
            <div className='my-4'>
              <Heading16px text={'Routines'} />
            </div>
          )}

          {miscellaneousRoutines?.map(routine => (
            <DraggableListItem
              key={routine.id}
              list={routine}
              handleDragStart={handleDragStart}
              style={routineStyle}
            />
          ))}
        </div>

        <div className='w-56'>
          {miscellaneousLists && (
            <div className='my-4'>
              <Heading16px text={'Lists'} />
            </div>
          )}

          {miscellaneousLists?.map(list => (
            <DraggableListItem
              key={list.id}
              list={list}
              handleDragStart={handleDragStart}
              style={listStyle}
            />
          ))}
        </div>

      </div>
    </>
  )
}

export default MiscellaneousLists