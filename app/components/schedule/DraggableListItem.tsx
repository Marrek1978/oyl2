
import type { ListAndToDos } from '~/types/listTypes';
import type { RoutineAndTasks } from '~/types/routineTypes';

type Props = {
  list: ListAndToDos | RoutineAndTasks;
  handleDragStart: (event: any) => void;
  style: string;
}

function DraggableListItem({ list, handleDragStart, style}: Props) {

  return (
    <>
      <div className={` ${style} scheduler-draggableLists-common`}
        draggable="true"
        onDragStart={() => handleDragStart(list)}
        key={list.id}
      >
        <div>
          {list.title}
        </div>
      </div>
    </>
  )
}

export default DraggableListItem