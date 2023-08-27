import ListCardBg from '../list/ListCardBg';
import RoutineToDoItem from './RoutineToDoItem';

import type { RoutineToDo } from '@prisma/client';
import type { RoutineAndToDos } from '~/types/routineTypes';

interface RoutineCardProps {
  routine: RoutineAndToDos;
}

function RoutineCard({ routine }: RoutineCardProps) {

  const title = routine.title
  const routineToDosArray: RoutineToDo[] = routine.routineToDos
  const id = routine.id

  return (
    <>
      <ListCardBg
        title={title}
        maxWidth='400px'
        listId={id}
      >
        < div className="mx-6 my-4 max-h-32" >
          {routineToDosArray.map((routineItemObj, index) => {
            return (
              <RoutineToDoItem
                key={index}
                routineObject={routineItemObj}
              />
            )
          })}
        </ div>
      </ListCardBg>
    </>
  )
}

export default RoutineCard