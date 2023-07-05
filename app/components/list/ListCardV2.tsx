import React from 'react'
import type { ListAndToDos } from '~/types/listTypes';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { EditIcon } from '../utilities/icons';
import { Link } from '@remix-run/react';

interface ListCardProps {
  listItem: ListAndToDos;
}


const ListCardV2: React.FC<ListCardProps> = ({
  listItem,
}) => {

  const listTitle = listItem.title
  const todosArray = listItem.todos
  const id = listItem.id

  return (
    <>
      <div
        className="
          flex-[1_1_300px] 
          max-w-[400px] min-w-[250px]
          font-poppins text-primary-content
          truncate 
          pb-3
          shadow-xl
        ">
        <div
          className="
          w-full h-[48px]
          flex justify-between items-center  gap-4
          bg-base-content 
          px-6
          ">
          <div className='
            text-primary-300 font-mont uppercase font-medium text-sm  tracking-widest 
            truncate overflow-ellipsis '>
            {listTitle}
          </div>
          <Link to={'/dash/todos/' + id}>
            <div className='flex gap-2 items-center
                text-info font-mont font-bold text-sm  uppercase
                hover:scale-105 transition-all '>
              OPEN {EditIcon}
            </div>
          </Link>
        </div >

        < div className="mx-6 mt-4 h-48" >
          {todosArray.map((todoObj, index) => {
            const priorityStyling = ToDoItemStylesNoBg({ todo: todoObj })
            return (
              <div
                key={index}
                className={` 
                    flex w-full items-center content-center
                    p-0 m-0
                    text-left 
                   ${priorityStyling}
                    `}>
                <div className={`w-3/5 wrap truncate text-ellipsis	${todoObj.complete && 'line-through text-slate-300'}`} >
                  {todoObj.body}
                </div>

                {todoObj.dueDate && (
                  <div className={`text-xs font-medium text-slate-400 self-center ${todoObj.complete && 'line-through text-slate-300'}`}>
                    {format(new Date(todoObj.dueDate), 'EEE, MMM d', { locale: enUS })}
                  </div>
                )}
              </div>
            )
          })}
        </ div>
      </div >
    </>
  )
}

export default ListCardV2