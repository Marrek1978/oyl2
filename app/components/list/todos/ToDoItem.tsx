import React from 'react';
import { FiEdit, FiDelete } from 'react-icons/fi'
import {ToDoItemStyles} from '../../../styles/ToDoItemStyles';
import type { CreationTodo } from '~/types/listTypes';
import { formatDate } from '~/utils/functions';

interface ToDoItemProps {
  todo: CreationTodo;
  id: string;
  removeTodo: (todoIndex: string) => void;
  editTodo: (todoIndex: string) => void;
}

const formatDate = (dateString: Date | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
};

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
        <div className="flex w-full justify-between "  >
          <div className={`w-2/3 wrap truncate text-ellipsis	${todo['complete'] && 'line-through'}`} >
            {todo['body']}
          </div>
          {formattedDate && (
            <div className="min-w-max text-xs font-medium text-slate-400 self-center mr-2">
              {formattedDate}
            </div>
          )}

          <div className="flex">
            <label 
            htmlFor={`edit-todo-modal-${todo?.id}`}
              className="btn btn-xs btn-outline btn-info mr-3"
              onClick={() => editTodo(id)}
            ><FiEdit /> </label>
         
            <button
              className="btn btn-xs btn-outline btn-error"
              onClick={() => removeTodo(id)}
            ><FiDelete />
            </button>
          </div>
        </div>

      </div>
    </>
  )
};

export default ToDoItem;
