import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { formatDate } from '~/utils/functions';
import { ToDoItemStyles } from '~/styles/ToDoItemStyles';
import { EditIcon, trashIcon } from '~/components/utilities/icons';
import OutlinedIconOnlyBtn from '~/components/buttons/OutlinedIconOnlyBtn';

import type { CreationTodo } from '~/types/listTypes';
import type { ToDo } from "@prisma/client";


interface SortableItemProps {
  id: string,
  todo: CreationTodo | ToDo
  removeTodo: (todoIndex: string) => void;
  handleOpenEditModal: (todoIndex: string) => void;
}

function SortableToDo({ id, todo, removeTodo, handleOpenEditModal }: SortableItemProps) {
  const formattedDate = formatDate(todo['dueDate']);
  const priorityStyling = ToDoItemStyles({todo})

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
          px-3 py-2 w-full mt-2 max-w-prose truncate
          cursor-pointer 
          font-poppins text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
         ${priorityStyling}
        `}>
        <div className="flex w-full justify-between "  >
          <div className={`w-2/3 wrap truncate text-ellipsis capitalize	${todo['isComplete'] && 'line-through'}`} >
            {todo['body']}
          </div>
          {formattedDate && (
            <div className="min-w-max text-xs font-medium text-slate-400 self-center mr-2 ">
              {formattedDate}
            </div>
          )}

          <div className="flex gap-4">
            <label
              htmlFor={`edit-todo-modal-${todo?.id}`}
              className="btn btn-xs btn-outline btn-info rounded-none "
              onClick={() => handleOpenEditModal(id)}
            >{EditIcon} </label>

            <OutlinedIconOnlyBtn
              onClickFunction={() => removeTodo(id)}
              icon={trashIcon}
              daisyUIBtnColor='error'
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default SortableToDo;
