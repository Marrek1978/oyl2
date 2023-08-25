import React, { useEffect, useState } from 'react'
import { Link, useFetcher } from '@remix-run/react';
import Divider from '~/components/utilities/Divider'
import { sortTodos } from '~/components/utilities/helperFunctions';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import ToDoWithCompletedBox from '~/components/list/todos/ToDoWithCompletedBox';
import { closeIcon, downArrowsIcon, trashIcon } from '~/components/utilities/icons';

import type { ListAndToDos } from '~/types/listTypes';
import OutlinedBtn from '../buttons/OutlinedBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import SolidBtn from '../buttons/SolidBtn';

interface TodosCompletedFormProps {
  list: ListAndToDos;
}

function TodosCompletedForm({ list }: TodosCompletedFormProps) {

  const fetcher = useFetcher();
  const todos = list.todos;
  const [isDeletingToDos, setIsDeletingToDos] = useState<boolean>(false)


  useEffect(() => {
    if (fetcher.data === 'deleted' && fetcher.state === 'idle') {
      setIsDeletingToDos(false)
    }
  }, [fetcher])

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
    setIsDeletingToDos(true)
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

      <BasicFormAreaBG
        title={list.title}
        linkDestination='edit'
        linkText='EDIT TO-DO LIST'
        linkColor='text-info'
      >

        <div className='py-6 px-8 font-poppins  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
            {todos.map((todoItem, index) => {
              return <ToDoWithCompletedBox
                key={todoItem.id}
                todoItem={todoItem}
              />
            })}
          </div>

          {todos.some(todo => todo.complete === true) && (
            <div>
              <Divider />
              <div className='w-full mt-8 flex justify-between items-center gap-8'>

                <div className='flex-1'>
                  {todos.filter(todo => todo.complete).length > 0
                    && todos.filter(todo => !todo.complete).length > 0
                    && (

                      <OutlinedBtn
                        text='Move Completed ToDos Down'
                        onClickFunction={handleCompletedToBottom}
                        daisyUIBtnColor='primary'
                        icon={downArrowsIcon}
                      />
                    )}
                </div>

                <div className='flex-1'>
                  <SolidBtn
                    text='Delete Completed To-Dos'
                    onClickFunction={handleDeleteCompletedToDos}
                    daisyUIBtnColor='error'
                    icon={trashIcon}
                    disableBtn={isDeletingToDos}
                  />

                </div>
              </div>
            </div>
          )}

          <div className='w-full mt-8 flex gap-8 '>
            <div className='w-full flex-1 '>
              <Link to='delete' >
                <OutlinedBtn
                  text='Delete List'
                  onClickFunction={() => { }}
                  daisyUIBtnColor='error'
                />
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
        {/* </div> */}
      </BasicFormAreaBG>

    </>
  )
}

export default TodosCompletedForm