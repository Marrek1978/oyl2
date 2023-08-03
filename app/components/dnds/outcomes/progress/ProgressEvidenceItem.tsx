import type { DesireOutcomeProgress } from '@prisma/client';
import React from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from '@dnd-kit/sortable';
import { FiEdit } from 'react-icons/fi'
import type { NewlyCreatedProgress } from '~/types/progressTypes';
import { smallTrashIcon } from '~/components/utilities/icons';

interface ProgressEvidenceItemProps {
  id: DesireOutcomeProgress['id'];
  progress: DesireOutcomeProgress | NewlyCreatedProgress;
  removeTodo: (todoIndex: string) => void;
  editTodo: (todoIndex: string) => void;
}



function ProgressEvidenceItem({ id, progress, removeTodo, editTodo }: ProgressEvidenceItemProps) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDate = formatDate(progress?.dueDate);


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" mt-4">
        <div key={id} id={id}
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
           `}>
          <div className="flex w-full justify-between "  >
            <div className={`w-2/3 wrap truncate text-ellipsis	${progress?.complete && 'line-through'}`} >
              {progress?.title}
            </div>
            {formattedDate && (
              <div className="min-w-max text-xs font-medium text-slate-400 self-center mr-2">
                {formattedDate}
              </div>
            )}

            <div className="flex">
              <label
                htmlFor={`edit-todo-modal-${progress?.id}`}
                className="btn btn-xs btn-outline btn-info mr-3"
                onClick={() => editTodo(id)}
              ><FiEdit /> </label>

              <button
                className="btn btn-xs btn-outline btn-error"
                onClick={() => removeTodo(id)}
              >{smallTrashIcon}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
};

export default ProgressEvidenceItem

const formatDate = (dateString: Date | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
};