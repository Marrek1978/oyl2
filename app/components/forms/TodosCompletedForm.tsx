import { useEffect, useState } from 'react'
import { useFetcher, useMatches } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import { sortTodos } from '~/components/utilities/helperFunctions';
// import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import ToDoWithCompletedBox from '~/components/list/todos/ToDoWithCompletedBox';
import { downArrowsIcon, trashIcon } from '~/components/utilities/icons';


import type { ListAndToDos, Todo } from '~/types/listTypes';
import FormButtons from './FormButtons';
import BtnWithProps from '../buttons/BtnWithProps';
import { set } from 'date-fns';

interface TodosCompletedFormProps {
  list: ListAndToDos;
}

function TodosCompletedForm({ list }: TodosCompletedFormProps) {

  // const todos = list?.todos;
  const matches = useMatches()
  const fetcher = useFetcher();
  const [isDeletingToDos, setIsDeletingToDos] = useState<boolean>(false)
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isDisableMoveDownBtn, setIsDisableMoveDownBtn] = useState<boolean>(false)

  const [isShowCloseBtn, setIsShowCloseBtn] = useState<boolean>(true)
  const [isACompletedToDo, setIsACompletedToDo] = useState<boolean>(false)


  const [todos, setTodos] = useState<Todo[]>([])



  useEffect(() => {
    matches.find((match => match.id === 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId'))
      && setIsShowCloseBtn(false)
  }, [matches])


  useEffect(() => {
    if (!list.todos) return
    const properlySortedTodos = sortTodos(list.todos);
    setTodos(properlySortedTodos)
  }, [list.todos])

  // useEffect(() => {
  // }, [matches])

  useEffect(() => {
    setIsACompletedToDo(todos.some(todo => todo.isComplete === true))
  }, [todos])


  // useEffect(() => {
  //   fetcher.data === 'deleted' && fetcher.state === 'idle' && (setIsDeletingToDos(false))
  // }, [fetcher])


  // useEffect(() => {
  //   const properlySortedTodos = sortTodos(todos);
  //   setTodos(properlySortedTodos)
  // const todosBySortOrder = todos.sort((a, b) => a.sortOrder - b.sortOrder)
  // const todosBySortOrder = todos.sort((a, b) => {
  //   // If a is completed and b is not, a should come after b
  //   if (a.isComplete && !b.isComplete) return 1;

  //   // If b is completed and a is not, b should come after a
  //   if (b.isComplete && !a.isComplete) return -1;

  //   // If both have the same completion status, sort by sortOrder
  //   return a.sortOrder - b.sortOrder;
  // });
  // const isSorted = properlySortedTodos.every((todo, index) => todo.id === todosBySortOrder[index].id)
  // setIsDisableMoveDownBtn(isSorted)

  // }, [todos])


  // const handleCompletedToBottom = async (): Promise<void> => {
  //   const completedToDosAtBottom = sortTodos(todos);
  //   const completedToDosAtBottomString = JSON.stringify(completedToDosAtBottom)
  //   try {
  //     fetcher.submit({
  //       todos: completedToDosAtBottomString,
  //     }, { method: 'PUT' })
  //   } catch (error) { throw error }
  // };


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
        h2Text={list.title}
        linkDestination='edit'
        linkText='EDIT TO-DO LIST'
        linkColorDaisyUI='info'
      >

        <div className='p-8  form-control gap-y-6 '>
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

          {/* {todos.some(todo => todo.isComplete === true) && (
            <div>
              <div className='w-full mt-8 flex justify-between items-center gap-8'>

                <div className='flex-1'>
                  {todos.filter(todo => todo.isComplete).length > 0
                    // && todos.filter(todo => !todo.isComplete).length > 0
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

                </div>
              </div>
            </div>
          )} */}


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
            isShowCloseBtn={isShowCloseBtn}
            deleteBtnText='Delete List'
            deleteBtnLink='delete'
          />

        </div>
      </BasicFormAreaBG>
    </>
  )
}

export default TodosCompletedForm