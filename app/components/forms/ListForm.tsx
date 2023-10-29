import { v4 as uuidv4 } from "uuid";
import { Form, useFetcher, useParams } from '@remix-run/react';
import React, { useEffect, useMemo, useState } from 'react'

import Divider from '~/components/utilities/Divider';
import DatePicker from '~/components/list/DatePicker';
import HeadingH2 from "~/components/titles/HeadingH2";
import DndTodos from '~/components/dnds/todos/DndTodos';
import FormButtons from "~/components/forms/FormButtons";
import BtnWithProps from "~/components/buttons/BtnWithProps";
import { ArrowIcon45deg } from "~/components/utilities/icons";
import SubHeading14px from "~/components/titles/SubHeading14px";
import BasicFormAreaBG from "~/components/forms/BasicFormAreaBG";
import EditListToDoModal from '~/components/modals/EditListToDoModal';
import useServerMessages from "~/components/modals/useServerMessages";
import { DesireOutcomeGuideline } from "~/components/utilities/Guidelines";
import useGetNavigationState from "~/components/utilities/useNavigationState";
import { headerText, useSaveBtnText } from "~/components/forms/FormsCommonFunctions";
import { sortTodos, resetTodoSortOrder } from '~/components/utilities/helperFunctions';
import InputLabelWithGuideLineLink from "~/components/forms/InputLabelWithGuideLineLink";
import ToggleWithLabelAndGuideLineLink from "~/components/forms/ToggleWithLabelAndGuideLineLink";

import type { CreationTodo, ListAndToDos } from '~/types/listTypes';

interface TodosListFormProps {
  list?: ListAndToDos;
  isNew?: boolean
  nextSortOrder?: number
}

function ListForm({ list, isNew = true, nextSortOrder }: TodosListFormProps) {

  const params = useParams()
  const fetcher = useFetcher()

  const [todoText, setTodoText] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [listId, setListId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [outcomeId, setOutcomeId] = useState<string>('')
  const [todos, setTodos] = useState<CreationTodo[]>([]);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isAddable, setIsAddable] = useState<boolean>(false)
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);

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
    const isInputEmpty = !todoText
    setIsAddable(!isInputEmpty)
  }, [todoText])


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
    if (todoText) {
      addTodoToTodosArray();
      setTodoText('');
      setIsUrgent(false);
      setIsImportant(false);
      setSelectedDate(null);
    }
  }


  const addTodoToTodosArray = () => {
    const id = uuidv4();
    const newTodo: CreationTodo = {
      id,
      body: todoText,
      isUrgent,
      isImportant,
      isComplete: false,
      dueDate: selectedDate || null,
      sortOrder
    }
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, newTodo];
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
    console.log('updateding todo', updatedTodo)
    setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };


  return (
    <>
      <BasicFormAreaBG h2Text={headerTxt}  >
        <Form method='post' className='  form-control gap-y-4 p-8'>
          <input type="string" name='id' value={listId} hidden readOnly />
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type='string' name='outcomeId' value={outcomeId} hidden readOnly />

          <div className=' flex gap-12 flex-wrap'>
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

              <div className='mt-4 '>  <Divider />   </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  inputTitle='Add a To-do'
                  guideLineTitle='To-dos'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a To-Do"
                  value={todoText}
                  onChange={(e) => setTodoText(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <div className='w-full  flex flex-col items-end gap-y-4'>

                <div className="checkbox-label-flex min-w-[230px] ">
                  <ToggleWithLabelAndGuideLineLink
                    text='Urgent'
                    guideline={DesireOutcomeGuideline}
                    guidelineTitle='Milestone Description'
                    checkedState={isUrgent}
                    handleCheckedState={handleIsUrgent}
                    toggleColorDaisyUI='accent'
                    isSecondaryInput={true}
                  />
                </div>

                <div className={`checkbox-label-flex min-w-[230px]`}>
                  <ToggleWithLabelAndGuideLineLink
                    text='Important'
                    guideline={DesireOutcomeGuideline}
                    guidelineTitle='Milestone Description'
                    checkedState={isImportant}
                    handleCheckedState={handleIsImportant}
                    toggleColorDaisyUI='success'
                    isSecondaryInput={true}
                  />
                </div>

                <div className={` min-w-[230px] text-base-content/70`}>
                  <DatePicker
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    isSecondaryInput={true}
                  />
                </div>
              </div>


              <BtnWithProps
                btnPurpose={'save'}
                isOutlined={true}
                btnLabel={'Add To-Do to List'}
                icon={ArrowIcon45deg}
                isBtnDisabled={!isAddable}
                onClickFunction={handleAddTodoToList}
              />
            </div>

            {/* //? PREVIEW PANEL */}
            <div className="flex-1 form-control gap-y-6 justify-between">
              <div>
                <div className='mt-1 text-success'>
                  <SubHeading14px text='Preview' />
                </div>
                <div className={`mt-2 truncate max-w-sm capitalize ${title ? 'text-base-content' : 'text-base-content/60'} `}>
                  <HeadingH2 text={title || 'List Title'} />
                </div>


                <div className=' max-h-[360px] overflow-auto overflow-x-hidden mt-4 pr-2'>
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
            </div>
          </div>

          {!isNew && (

            <FormButtons
              isShowSaveBtn={false}
              isNew={isNew}
              isShowCloseBtn={!isNew}
              saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
              saveBtnType={'button'}
              deleteBtnText={'Delete List'}
              flexXGap={'12'}
            />
          )}
        </Form >
      </BasicFormAreaBG >


      {isEditToDoModalOpen && (
        <EditListToDoModal
          todo={selectedTodo}
          setIsEditToDoModalOpen={setIsEditToDoModalOpen}
          updateTodo={updateTodo}
          index={selectedTodoIndex}
        />
      )
      }
    </>
  )
}

export default ListForm