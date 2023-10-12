import { v4 as uuidv4 } from "uuid";
import { Form, useFetcher, useParams } from '@remix-run/react';
import React, { useEffect, useMemo, useState } from 'react'

import FormButtons from "./FormButtons";
import HeadingH2 from "../titles/HeadingH2";
import BasicFormAreaBG from "./BasicFormAreaBG";
import Divider from '~/components/utilities/Divider';
import SubHeading14px from "../titles/SubHeading14px";
import DatePicker from '~/components/list/DatePicker';
import DndTodos from '~/components/dnds/todos/DndTodos';
import useServerMessages from "../modals/useServerMessages";
import { DesireOutcomeGuideline } from "../utilities/Guidelines";
import { headerText, useSaveBtnText } from "./FormsCommonFunctions";
import useGetNavigationState from "../utilities/useNavigationState";
import EditListToDoModal from '~/components/modals/EditListToDoModal';
import InputLabelWithGuideLineLink from "./InputLabelWithGuideLineLink";
import ToggleWithLabelAndGuideLineLink from "./ToggleWithLabelAndGuideLineLink";
import { sortTodos, resetTodoSortOrder } from '~/components/utilities/helperFunctions';


import type { CreationTodo, ListAndToDos } from '~/types/listTypes';
import BtnWithProps from "../buttons/BtnWithProps";
import { ArrowIcon45deg } from "../utilities/icons";

interface TodosListFormProps {
  list?: ListAndToDos;
  isNew?: boolean
  nextSortOrder?: number
}

function ListForm({ list, isNew = true, nextSortOrder }: TodosListFormProps) {

  const params = useParams()
  const fetcher = useFetcher()

  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<CreationTodo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [listId, setListId] = useState<string>('')
  const [outcomeId, setOutcomeId] = useState<string>('')
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isAddable, setIsAddable] = useState<boolean>(false)
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);

  const { isIdle, navigationState } = useGetNavigationState()
  useServerMessages({ fetcherState: navigationState, isShowFailed: true })

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'To-Do List')
  const headerTxt = useMemo(() => headerText(isNew, 'To-Do List', list?.title || ''), [isNew, list?.title])


  useEffect(() => {
    setTitle(list?.title || '');
    setTodos(list?.todos || []);
    setListId(list?.id || '')
    setSortOrder(list?.sortOrder || nextSortOrder || 0)
    setOutcomeId(list?.outcomeId || params.outcomeId || '')
  }, [list, params, nextSortOrder])


  useEffect(() => {
    const isInputEmpty = !title || todos.length === 0
    const isInputDifferent = title !== list?.title || todos !== list?.todos
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [todos, title, list])


  useEffect(() => {
    const isInputEmpty = !todo
    console.log("🚀 ~ file: ListForm.tsx:77 ~ useEffect ~ isInputEmpty:", isInputEmpty)
    setIsAddable(!isInputEmpty)
  }, [todo])


  const handleSave = async () => {
    const todosString = JSON.stringify(todos);
    try {
      fetcher.submit({
        title,
        todosString,
        outcomeId,
        sortOrder,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearListState();
  }

  const handleEdits = async () => {
    const todosString = JSON.stringify(todos);
    try {
      fetcher.submit({
        id: listId,
        title,
        todosString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    clearListState();
  }

  const clearListState = () => {
    setTitle('')
    setTodos([])
    setListId('')
    setSortOrder(0)
    setOutcomeId('')
  }


  const handleAddTodoToList = () => {
    if (todo) {
      addTodoToTodosState(todo);
      setTodo('');
      setIsUrgent(false);
      setIsImportant(false);
      setSelectedDate(null);
    }
  }


  const addTodoToTodosState = (newTodo: string) => {
    const id = uuidv4();
    const todo: CreationTodo = {
      id,
      body: newTodo,
      urgent: isUrgent,
      important: isImportant,
      complete: false,
      dueDate: selectedDate || null,
      sortOrder: 0
    }
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, todo];
      return sortTodos(updatedTodos);
    });
  };

  const handleIsUrgent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUrgent) {
      isImportant && setIsImportant(false)
    }
    setIsUrgent(e.target.checked)
  }

  const handleIsImportant = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isImportant) {
      isUrgent && setIsUrgent(false)
    }
    setIsImportant(e.target.checked)
  }

  const updateTodo = (index: number | null, updatedTodo: CreationTodo) => {
    setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };


  return (
    <>

      <BasicFormAreaBG h2Text={headerTxt}  >
        <Form method='post' className='  form-control gap-y-8 p-8'>
          <input type="string" name='id' value={listId} hidden readOnly />
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type='string' name='outcomeId' value={outcomeId} hidden readOnly />

          <div className=' flex gap-8 flex-wrap'>

            <div className="flex-1 form-control gap-y-8 ">
              <div >
                <InputLabelWithGuideLineLink
                  inputTitle='List Title'
                  guideLineTitle='List Title'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a List Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <div className=' '>  <Divider />   </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  inputTitle='Add a To-do'
                  guideLineTitle='To-dos'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a To-Do"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <div className='w-full  flex flex-col items-end gap-y-4'>

                <div className="checkbox-label-flex min-w-[230px] ">
                  <ToggleWithLabelAndGuideLineLink
                    text='Urgent'
                    guideline={DesireOutcomeGuideline}
                    title='Milestone Description'
                    checkedState={isUrgent}
                    handleCheckedState={handleIsUrgent}
                    toggleColorDaisyUI='accent'
                  />
                </div>

                <div className={`checkbox-label-flex min-w-[230px]`}>
                  <ToggleWithLabelAndGuideLineLink
                    text='Important'
                    guideline={DesireOutcomeGuideline}
                    title='Milestone Description'
                    checkedState={isImportant}
                    handleCheckedState={handleIsImportant}
                    toggleColorDaisyUI='success'
                  />
                </div>

                <div className={` min-w-[230px]`}>
                  <DatePicker
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>


              <BtnWithProps
                btnPurpose={'save'}
                isOutlined={true}
                btnLabel={'Add to List'}
                icon={ArrowIcon45deg}
                isBtnDisabled={!isAddable}
                onClickFunction={handleAddTodoToList}
              />
            </div>

            {/* //? PREVIEW PANEL */}
            <div className="flex-1 form-control gap-y-6 justify-between">
              <div>
                <div className='mt-3 text-success'>
                  <SubHeading14px text='To-Do List Preview' />
                </div>
                <div className={`mt-2 truncate max-w-sm capitalize ${title ? 'text-base-content' : 'text-base-content/60'} `}>
                  <HeadingH2 text={title || 'List Title'} />
                </div>

                <div className={` ${todos.length ? 'text-base-content' : 'text-base-content/60'}  mt-8`}>
                  <SubHeading14px text={`To-Dos`} />
                </div>

                <div className=' max-h-[375px] overflow-auto overflow-x-hidden mt-1'>
                  <DndTodos
                    setTodos={setTodos}
                    todos={todos}
                    setTodoSortOrder={resetTodoSortOrder}
                    setIsEditToDoModalOpen={setIsEditToDoModalOpen}
                    setSelectedTodoIndex={setSelectedTodoIndex}
                    setSelectedTodo={setSelectedTodo} />
                </div>
              </div>

              {/* //******** BUTTONS   **************** */}
              <div className=" justify-end  ">


                <BtnWithProps
                  btnPurpose={'save'}
                  btnLabel={saveBtnTxt}
                  isBtnDisabled={!isSaveable || !isIdle}
                  onClickFunction={isNew ? handleSave : handleEdits}
                />
              </div>

  
              {/* <div className="flex flex-col gap-4">
           

                <Link to='..'>
                  <SolidBtnGreyBlue
                    text={listTitle || todos.length > 0
                      ? ('Close without Saving')
                      : ('Close')}
                    onClickFunction={() => { }}
                    icon={closeIcon}
                  />
                </Link>

                {!isNew && (
                  <Link to='../delete'>
                    <OutlinedBtn
                      text='Delete List'
                      onClickFunction={() => { }}
                      daisyUIBtnColor='error'
                    />
                  </Link>
                )}
              </div> */}

            </div>
          </div>

          <FormButtons
          isShowSaveBtn={false}
            isNew={isNew}
            isShowCloseBtn={!isNew}
            saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
            saveBtnType={'button'}
          />



        </Form >
      </BasicFormAreaBG >


      {isEditToDoModalOpen && (
        <>
          <EditListToDoModal
            todo={selectedTodo}
            setIsEditToDoModalOpen={setIsEditToDoModalOpen}
            updateTodo={updateTodo}
            index={selectedTodoIndex}
          />
        </>
      )
      }
    </>
  )
}

export default ListForm