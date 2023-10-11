import React from 'react';
import { formatDate } from '~/utils/functions';

import { ToDoItemStyles } from '../../../styles/ToDoItemStyles';
import { EditIcon, trashIcon } from '~/components/utilities/icons';
import OutlinedIconOnlyBtn from '~/components/buttons/OutlinedIconOnlyBtn';

import type { CreationTodo } from '~/types/listTypes';
// import DndSortableStyling from '~/components/dnds/DndSortableStyling';

interface ToDoItemProps {
  todo: CreationTodo;
  id: string;
  removeTodo: (todoIndex: string) => void;
  editTodo: (todoIndex: string) => void;
}


const ToDoItem: React.FC<ToDoItemProps> = ({ todo, id, removeTodo, editTodo }) => {
  const formattedDate = formatDate(todo['dueDate']);

  const priorityStyling = ToDoItemStyles({ todo })

  return (
    <>
      <div
        className={`block 
          rounded-none
          px-3 py-2 w-full  
          mt-2
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
         ${priorityStyling}
           `}>
      {/* <DndSortableStyling priorityStyling={priorityStyling}> */}
        <div className="flex w-full justify-between "  >
          <div className={`w-2/3 wrap truncate text-ellipsis	${todo['complete'] && 'line-through'}`} >
            {todo['body']}
          </div>
          {formattedDate && (
            <div className="min-w-max text-xs font-medium text-slate-400 self-center mr-2">
              {formattedDate}
            </div>
          )}

          <div className="flex gap-4">
            <label
              htmlFor={`edit-todo-modal-${todo?.id}`}
              className="btn btn-xs btn-outline btn-info rounded-none"
              onClick={() => editTodo(id)}
            >{EditIcon} </label>

            <OutlinedIconOnlyBtn
              onClickFunction={() => removeTodo(id)}
              icon={trashIcon}
              daisyUIBtnColor='error'
            />

          </div>
        </div>

        </div>
      {/* </DndSortableStyling> */}
    </>
  )
};

export default ToDoItem;
