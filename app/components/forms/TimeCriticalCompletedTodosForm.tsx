import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import FormButtons from './FormButtons';
import { trashIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import BtnWithProps from '../buttons/BtnWithProps';
import { sortTodos } from '../utilities/helperFunctions';
import ToDoWithCompletedBox from '../list/todos/ToDoWithCompletedBox';
import useFormSubmittedToastUsingFetcher from '../utilities/useFormSubmittedToastUsingFetcher';

import type { ToDo } from '@prisma/client';


//! take in list wtih todos,  you need to add a link to the list in the todoWithCompletedBox --- it probably needs to be a TimeCriticalToDoWithCompletedBox component.

interface TodosCompletedFormProps {
  list: ToDo[];  
  formTitle: string;
}

function TimeCriticalCompletedTodosForm({ list, formTitle = 'New Title' }: TodosCompletedFormProps) {

  const fetcher = useFetcher();
  const [todos, setTodos] = useState<ToDo[]>([])
  const [numItemsToDelete, setNumItemsToDelete] = useState<number>(0)
  const [isDeletingToDos, setIsDeletingToDos] = useState<boolean>(false)
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isACompletedToDo, setIsACompletedToDo] = useState<boolean>(false)

  let toastMessage = `Deleted ${numItemsToDelete} ToDo${(numItemsToDelete > 1) ? 's' : ''}`
  useFormSubmittedToastUsingFetcher({ fetcher, redirectTo: '../', message: toastMessage })

  useEffect(() => {
    if (!list) return

    let todosArray: ToDo[] = []
    list.forEach((todo) => {
      todosArray.push(todo as ToDo)
    })

    setTodos(sortTodos(todosArray))
  }, [list])


  useEffect(() => {
    setIsACompletedToDo(todos.some(todo => todo.isComplete === true))
  }, [todos])


  const handleDeleteCompletedToDos = async (): Promise<void> => {
    setIsDeletingToDos(true)
    const toDosToDeleteArr = todos.filter(todo => todo.isComplete === true).map(todo => todo.id)
    setNumItemsToDelete(toDosToDeleteArr.length)
    const completedToDoIds: string = JSON.stringify(toDosToDeleteArr)

    try {
      fetcher.submit({
        completedToDoIds
      }, {
        method: 'DELETE',
      })
    } catch (error) { throw error }
  }


  return (
    <>
      <BasicFormAreaBG
        h2Text={formTitle}
      >


{/* //!  probably needs to be a TimeCriticalToDoWithCompletedBox component to have a link to the list
//!!!  pass the list id too for a link */}


        <div className='p-8  form-control gap-y-6  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto  ">
            {todos?.map((todo, index) => {
              return (
                <ToDoWithCompletedBox
                  key={todo.id}
                  todoItem={todo}
                  setIsDisableAllBtns={setIsDisableAllBtns}
                  isDisableAllBtns={isDisableAllBtns}
                // daisyUIItemsColor={'success'}
                />
              )
            }
            )}
          </div>

          {isACompletedToDo && (
            <div className=' text-right flex justify-end'>
              <div className='flex-1 max-w-max' >
                <BtnWithProps
                  btnPurpose={'goto'}
                  onClickFunction={handleDeleteCompletedToDos}
                  isBtnDisabled={isDeletingToDos || isDisableAllBtns}
                  btnLabel={'Delete Completed To-Dos'}
                  textColorDaisyUI={'error'}
                  fontWidthTW={'bold'}
                  icon={trashIcon}
                  textSizeTW={'sm'}
                />
              </div>
            </div>
          )}

          <FormButtons
            isNew={false}
            isShowSaveBtn={false}
            isShowCloseBtn={true}
            isShowDeleteBtn={false}
          // deleteBtnText='Delete List'
          // deleteBtnLink='edit/delete'
          // isShowDeleteBtn={!isDeleteBtnDisabled}
          />

        </div>
      </BasicFormAreaBG>
    </>
  )
}

export default TimeCriticalCompletedTodosForm