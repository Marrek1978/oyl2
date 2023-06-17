import React from 'react'
import type { ListAndToDos } from '~/types/listTypes';
import CardHeader from '../CardHeader';
import { ToDoItemStylesNoBg } from '~/styles/ToDoItemStyles';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { EditIcon } from '../utilities/icons';
import { Link } from '@remix-run/react';



interface ListCardProps {
  listItem: ListAndToDos;
  // openCheckBoxModal: () => void;
  // setOpenCheckboxModalId: (id: string | null) => void;
  // openCheckboxModalId: string | null;
  // triggerRefreshRouteData: () => void;
}



const ListCardV2: React.FC<ListCardProps> = ({
  listItem,
  // openCheckBoxModal, 
  // setOpenCheckboxModalId,
  //  openCheckboxModalId, 
  //  triggerRefreshRouteData 
}) => {

  const listTitle = listItem.title
  const todosArray = listItem.todos
  const id = listItem.id

  return (
    <>
      <div
        className="block  bg-white 
          font-poppins text-navy-900
          w-[250px] max-h-[250px] pb-3
          overflow-hidden relative
          shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
        ">
        <div
          className=" flex justify-between items-center w-full 
          bg-base-content 
          py-2 px-6
          ">
          <div className='
            text-primary-300 font-mont uppercase font-medium tracking-widest 
            truncate overflow-ellipsis w-2/3'>
            {listTitle}
          </div>

          <Link to={id}>
            <div className='flex gap-2  
            font-bold font-mont text-xs  uppercase     
            cursor-pointer 
            text-primary-300
            '>  OPEN  {EditIcon}   </div>
          </Link>


        </div >

        {/* <//!-- days --> */}
        <div className="flex" >
        </div >

        {/* <//!-- todos   consider putting into diff component?  not sure if needed... maybe for editing made lists modal?--> */}
        < div className="mx-6 mt-4" >
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
          })
          }
        </ div>

        {todosArray.length > 3 && (
          <div className="h-6 w-full absolute bottom-0 left-0">
            <div className="h-full w-full bg-gradient-to-t from-slate-200 to-white"></div>
          </div>
        )
        }
      </div >

    </>
  )
}

export default ListCardV2