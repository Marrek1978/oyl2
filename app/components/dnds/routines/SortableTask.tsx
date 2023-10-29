import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { EditIcon, trashIcon } from '~/components/utilities/icons';
import OutlinedIconOnlyBtn from '~/components/buttons/OutlinedIconOnlyBtn';

import type{ CreationTask } from "~/types/routineTypes";


interface SortableTaskProps {
  id: string,
  task: CreationTask
  removeTask: (taskIndex: string) => void;
  handleOpenEditModal: (taskIndex: string) => void;
}

function SortableTask({ id, task, removeTask, handleOpenEditModal }: SortableTaskProps) {
  // const priorityStyling = ToDoItemStyles({ task })

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`
          block 
          rounded-none
          px-3 py-2 w-full mt-2
          cursor-pointer 
          font-poppins text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
         
        `}>
        <div className="flex w-full justify-between "  >
          <div className={`w-2/3 wrap truncate text-ellipsis capitalize	${task['isComplete'] && 'line-through'}`} >
            {task['body']}
          </div>
         

          <div className="flex gap-4">
            <label
              htmlFor={`edit-todo-modal-${task?.id}`}
              className="btn btn-xs btn-outline btn-info rounded-none "
              onClick={() => handleOpenEditModal(id)}
            >{EditIcon} </label>

            <OutlinedIconOnlyBtn
              onClickFunction={() => removeTask(id)}
              icon={trashIcon}
              daisyUIBtnColor='error'
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default SortableTask;
