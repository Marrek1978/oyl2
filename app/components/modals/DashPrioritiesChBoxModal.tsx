
import type { ListAndToDos, Todo } from '~/types/listTypes';
import ToDoWithCheckBox from '../list/todos/ToDoWithCheckBox';
import { sortTodos } from './EditListModal';
import { MouseEvent, useEffect, useState } from 'react';
import { useList } from '../list/ListContext';
import CloseLabelBtn from '../buttons/SolidLabelClose';
import HeaderLabel from '../LabelCardHeader';
import TextBtn from '../buttons/TextBtn';
import OutlinedLabelBtn from '../buttons/OutlinedLabelBtn';
import { trashIcon, downArrowsIcon, dbIcon } from '../utilities/icons';
import Divider from '~/components/utilities/Divider';
import ToDoWithCheckBoxForm from '../list/todos/ToDoWithCheckBoxForm';
import { Form } from '@remix-run/react';
import SolidBtn from '../buttons/SolidBtn';

interface DashPrioritiesChBoxModalProps {
  htmlFor: string;
  title: string | null;
  todos: Todo[] | null;
  
}

//? dashboard -> dashboard/todos -> ListCard
// <//! prob this whol component shoudl be reusable with a color option
const DashPrioritiesChBoxModal: React.FC<DashPrioritiesChBoxModalProps> = ({
  htmlFor,
  title,
  todos
}) => {

 
  return (
    <>
      <input type="checkbox" id={htmlFor} className="modal-toggle" />
      <div className="modal z-10 ">
        <div className="modal-box rounded-none p-0 m-0 min-w-[500px]">
          <div
            className={` w-full 
            bg-base-content
            px-8
            grid grid-cols-1 grid-rows-[24px_24px_24px]
            dark:border-neutral-600 dark:text-neutral-50
          `
            }>
            <div></div>
            <div className='flex justify-between items-center flex-none'>
              <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              w-4/5
              `}>
                {title}
              </div>
            </div>

          </div >

          <div className='py-6 px-8 font-poppins  '>
            <Form method='post' id='checkbox-form' >
              <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
                {todos?.map((todoItem, index) => {
                  return (
                    <ToDoWithCheckBoxForm
                      key={todoItem.id}
                      todoId={todoItem.id}
                      todoItem={todoItem}
                      index={index}
                      triggerRefreshRouteData={() => { }}
                    />
                  )
                })}
              </div>

              <div className='mb-8'>
                <Divider />
              </div >

              <div className='w-full flex justify-center items-center '>
                <SolidBtn 
                  text='Save Changes'
                  onClickFunction={()=>{}}
                  icon={dbIcon}
                  daisyUIBtnColor='primary'
                  />
              </div>
            </Form>

            <div className=' w-full mt-6 '>
              <CloseLabelBtn
                text={'Close (without saving)'}
                onClickFunction={()=>{}}
                htmlFor={htmlFor}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashPrioritiesChBoxModal