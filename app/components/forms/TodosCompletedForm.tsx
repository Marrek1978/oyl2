import { useEffect, useState } from 'react'
import { Link, useFetcher } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import Divider from '~/components/utilities/Divider'
import { sortTodos } from '~/components/utilities/helperFunctions';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import ToDoWithCompletedBox from '~/components/list/todos/ToDoWithCompletedBox';
import { closeIcon, downArrowsIcon, trashIcon } from '~/components/utilities/icons';


import type { ListAndToDos } from '~/types/listTypes';

interface TodosCompletedFormProps {
  list: ListAndToDos;
}

function TodosCompletedForm({ list }: TodosCompletedFormProps) {

  const fetcher = useFetcher();
  const todos = list.todos;
  const [isDeletingToDos, setIsDeletingToDos] = useState<boolean>(false)
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isDisableMoveDownBtn, setIsDisableMoveDownBtn] = useState<boolean>(false)


  useEffect(() => {
    fetcher.data === 'deleted' && fetcher.state === 'idle' && (  setIsDeletingToDos(false))
  }, [fetcher])


  useEffect(() => {
    const properlySortedTodos = sortTodos(todos);
    const todosBySortOrder = todos.sort((a, b) => a.sortOrder - b.sortOrder)
    const isSorted = properlySortedTodos.every((todo, index) => todo.id === todosBySortOrder[index].id)
    setIsDisableMoveDownBtn(isSorted)
  }, [todos])


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
              return (
                <ToDoWithCompletedBox
                  key={todoItem.id}
                  todoItem={todoItem}
                  setIsDisableAllBtns={setIsDisableAllBtns}
                  isDisableAllBtns={isDisableAllBtns}
                />
              )
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
                        text='Move Completed To-Dos Down'
                        onClickFunction={handleCompletedToBottom}
                        daisyUIBtnColor='primary'
                        icon={downArrowsIcon}
                        disabledBtnBoolean={isDisableMoveDownBtn || isDisableAllBtns}
                      />
                    )}
                </div>

                <div className='flex-1'>
                  <SolidBtn
                    text='Delete Completed To-Dos'
                    onClickFunction={handleDeleteCompletedToDos}
                    daisyUIBtnColor='error'
                    icon={trashIcon}
                    disableBtn={isDeletingToDos || isDisableAllBtns}
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
                  disabledBtnBoolean={isDisableAllBtns}
                />
              </Link>
            </div>

            <div className='w-full flex-1 '>
              <Link to='..' >
                <SolidBtnGreyBlue text='Close'
                  onClickFunction={() => { }}
                  icon={closeIcon}
                  disabledBtnBoolean={isDisableAllBtns}
                />
              </Link>
            </div>
          </div>
        </div>
      </BasicFormAreaBG>
    </>
  )
}

export default TodosCompletedForm