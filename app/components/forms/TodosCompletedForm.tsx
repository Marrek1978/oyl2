import React from 'react'
import { Link, useFetcher } from '@remix-run/react';
import TextBtn from '~/components/buttons/TextBtn';
import Divider from '~/components/utilities/Divider'
import { sortTodos } from '~/components/utilities/helperFunctions';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import ToDoWithCompletedBox from '~/components/list/todos/ToDoWithCompletedBox';
import { EditIcon, closeIcon, downArrowsIcon, trashIcon } from '~/components/utilities/icons';

import type { ListAndToDos } from '~/types/listTypes';

interface TodosCompletedFormProps {
  list: ListAndToDos;
}

function TodosCompletedForm({ list }: TodosCompletedFormProps) {

  const fetcher = useFetcher();
  const todos = list.todos;

  const handleCompletedToBottom = async (): Promise<void> => {
    const completedToDosAtBottom = sortTodos(todos);
    const completedToDosAtBottomString = JSON.stringify(completedToDosAtBottom)

    try {
      fetcher.submit({
        todos: completedToDosAtBottomString,
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }

  };

  const handleDeleteCompletedToDos = async (): Promise<void> => {

    try {
      fetcher.submit({
        id: list.id,
      }, {
        method: 'DELETE',
      })
    } catch (error) { throw error }
  }

  return (
    <>
      <div className='
          bg-base-100 
          grid grid-cols-[minmax(300px,600px)] grid-rows-[72px_1fr_min-content]
          cursor-default
        '>
        <div className='w-full h-full px-8 bg-base-content flex justify-between items-center'>
          <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              `}>
            {list.title}
          </div>
          <Link to='edit'>
            <div className='flex gap-2 items-center 
                font-mont font-bold text-info
                hover:scale-105 transition-all
                 '>
              Edit {EditIcon}
            </div>
          </Link>
        </div>

        <div className='py-6 px-8 font-poppins  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
            {todos.map((todoItem, index) => {
              return <ToDoWithCompletedBox
                key={todoItem.id}
                todoId={todoItem.id}
                todoItem={todoItem}
                index={index}
              />
            })}
          </div>

          <div>
            <Divider />
          </div>

          {todos.some(todo => todo.complete === true) && (
            <div className='w-full mt-8 flex justify-between items-center'>

              <div className='text-base font-mont font-semibold'>Completed To-Dos</div>
              <div>
                {todos.filter(todo => todo.complete).length > 0
                  && todos.filter(todo => !todo.complete).length > 0
                  && (
                    <TextBtn
                      text={'Move Down'}
                      icon={downArrowsIcon}
                      onClickFunction={handleCompletedToBottom}
                    />
                  )}
              </div>

              <div>
                <TextBtn
                  text={'Delete'}
                  icon={trashIcon}
                  onClickFunction={handleDeleteCompletedToDos}
                  color={'error'}
                />
              </div>
            </div>
          )}

          <div className='w-full mt-6 flex gap-6 '>
            <div className='w-full flex-1 '>
              <Link to='delete' >
                <button className='btn btn-error btn-outline  
                w-full
                rounded-none
                font-mont font-semibold
              ' >
                  Delete List
                  {trashIcon}
                </button>
              </Link>
            </div>

            <div className='w-full flex-1 '>
              <Link to='..' >
                <SolidBtnGreyBlue text='Close'
                  onClickFunction={() => { }}
                  icon={closeIcon}
                />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default TodosCompletedForm