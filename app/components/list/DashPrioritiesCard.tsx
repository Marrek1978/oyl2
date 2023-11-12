import React from 'react'
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ToDoItemStylesNoBg } from '../../styles/ToDoItemStyles';
import LabelCardHeader from '../LabelCardHeader';

import type { ToDo } from '@prisma/client';

// need to open a modal, from route    
interface DashPrioritiesCardProps {
  title: string;
  todos:ToDo[];
  htmlFor: string;
  onOpenFunction: () => void;
  setPriorityModalTitle: (title:string | null) => void;
  setPriorityModalTodos: (todos:ToDo[] | null) => void;
  headerColor?:string;
  textColor?:string;
  labelHoverColor?:string;
}

const DashPrioritiesCard: React.FC<DashPrioritiesCardProps> = ({ 
   title,
   todos,
   htmlFor,
   onOpenFunction,
   setPriorityModalTitle,
   setPriorityModalTodos,
   headerColor='bg-base-content',
   textColor='text-primary-300',
   labelHoverColor='text-primary-100'
 }) => {

  const todosArray = todos

  console.log('textcolor is', textColor)
  const onClickFunction = () => {
    onOpenFunction()
    setPriorityModalTitle(title)
    setPriorityModalTodos(todos)
  }
  
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
          className={`flex justify-between items-center w-full 
          ${headerColor} 
          py-2 px-6
          `}
          >
          <div className={`
            ${textColor} font-mont uppercase font-medium tracking-widest 
            truncate overflow-ellipsis w-2/3`}
            >
            {title}
          </div>

          <LabelCardHeader
            text='Open'
            htmlFor={htmlFor}
            onClickFunction={onClickFunction}
            textSizeTailwindClasses='text-xs'
            textColor={textColor}
            labelHoverColor={labelHoverColor}
          />

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
                <div className={`w-3/5 wrap truncate text-ellipsis	${todoObj.isComplete && 'line-through text-slate-300'}`} >
                  {todoObj.body}
                </div>

                {todoObj.dueDate && (
                  <div className={`text-xs font-medium text-slate-400 self-center ${todoObj.isComplete && 'line-through text-slate-300'}`}>
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

export default DashPrioritiesCard