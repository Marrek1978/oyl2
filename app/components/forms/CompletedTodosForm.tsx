import { useEffect, useState } from 'react'
import { useFetcher, useMatches } from '@remix-run/react';

import FormButtons from '~/components/forms/FormButtons';
import { trashIcon } from '~/components/utilities/icons';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { sortTodos } from '~/components/utilities/helperFunctions';
import ToDoWithCompletedBox from '~/components/list/todos/ToDoWithCompletedBox';

import type { ToDo } from '@prisma/client';
import type { ListAndToDos } from '~/types/listTypes';

interface TodosCompletedFormProps {
  list: ListAndToDos;
}

function CompletedTodosForm({ list }: TodosCompletedFormProps) {

  const matches = useMatches()
  const fetcher = useFetcher();

  const [todos, setTodos] = useState<ToDo[]>([])
  const [isShowCloseBtn, setIsShowCloseBtn] = useState<boolean>(true)
  const [isDeletingToDos, setIsDeletingToDos] = useState<boolean>(false)
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)
  const [isACompletedToDo, setIsACompletedToDo] = useState<boolean>(false)


  useEffect(() => {
    matches.find((match => match.id === 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.lists.$listId'))
      && setIsShowCloseBtn(false)
  }, [matches])


  useEffect(() => {
    if (!list.todos) return
    const properlySortedTodos = sortTodos(list.todos);
    setTodos(properlySortedTodos)
  }, [list.todos])


  useEffect(() => {
    setIsACompletedToDo(todos.some(todo => todo.isComplete === true))
  }, [todos])


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

        <div className='p-8  form-control gap-y-6  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto  ">
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
            deleteBtnLink='edit/delete'
          />

        </div>
      </BasicFormAreaBG>
    </>
  )
}

export default CompletedTodosForm