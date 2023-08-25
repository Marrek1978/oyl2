import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from 'react'
import { Form, Link, useFetcher, useNavigation, useParams, useSearchParams } from '@remix-run/react';

import InputLabel from './InputLabel';
import Modal from '~/components/modals/Modal';
import SolidBtn from '~/components/buttons/SolidBtn';
import Divider from '~/components/utilities/Divider';
import DatePicker from '~/components/list/DatePicker';
import DndTodos from '~/components/dnds/todos/DndTodos';
import OutlinedBtn from '~/components/buttons/OutlinedBtn';
import { closeIcon, dbIcon } from '~/components/utilities/icons';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import EditListToDoModal from '~/components/modals/EditListToDoModal';
import { sortTodos, resetTodoSortOrder } from '~/components/utilities/helperFunctions';

import type { CreationTodo, ListAndToDos } from '~/types/listTypes';
import InputLabelWithGuideLineLink from "./InputLabelWithGuideLineLink";
import { DesireOutcomeGuideline } from "../utilities/Guidelines";
import BasicFormAreaBG from "./BasicFormAreaBG";
import SubHeading14px from "../titles/SubHeading14px";
import HeadingH2 from "../titles/HeadingH2";

interface TodosListFormProps {
  list?: ListAndToDos;
  isNew: boolean;
  isProject: boolean;
}

function TodosListForm({ list, isNew = true, isProject = false }: TodosListFormProps) {

  const fetcher = useFetcher();
  const navigation = useNavigation();
  const inputToDoRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const { listId, projectId } = useParams()

  const [todos, setTodos] = useState<CreationTodo[]>([]);
  const [listTitle, setListTitle] = useState<string>('');

  // const [isNewList, setIsNewList] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const todoParam = searchParams.get('todo')
  console.log('todoParam', todoParam);
  console.log('listId is ', listId)
  console.log('projectId is ', projectId)

  const isSubmitting = navigation.state === 'submitting'
  const isIdle = navigation.state === 'idle'


  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNew
        ? "Save New List"
        : "Save Changes"

  //set actionpath based on if new or edit, project or random
  let actionPath: string;

  if (isNew && !isProject) {
    actionPath = '/dash/todos/new'
  }
  if (!isNew && !isProject) {
    actionPath = `/dash/todos/${listId}/edit`
  }


  useEffect(() => {
    if (fetcher.data) {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 1000);
    }
  }, [fetcher])

  useEffect(() => {
    if (list) {
      setListTitle(list.title);
      setTodos(list.todos);
    }
  }, [list])


  useEffect(() => {
    let saveable =
      isNew
        ? (listTitle && todos.length > 0) ? true : false
        : (listTitle !== list?.title || todos !== list?.todos) ? true : false
    setIsSaveable(saveable)
  }, [isNew, todos, listTitle, list, isIdle])


  const handleSave = async () => {

    console.log('saving new list')
    if (!projectId) {
      const todosString = JSON.stringify(todos);

      try {
        fetcher.submit({
          listTitle,
          todosString
        }, {
          method: 'POST',
          action: actionPath,
        })
        // setSuccessMessage('List was saved');
        // setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
      } catch (error) { throw error }
      clearListState();
    }
  }

  const clearListState = () => {
    setListTitle('')
    setTodos([])
  }

  const handleEdits = async () => {
    const editedList = { ...list, title: listTitle, todos }
    const editedListString = JSON.stringify(editedList);

    try {
      fetcher.submit({
        editedListString
      }, {
        method: 'PUT',
        action: actionPath,
      })

      // Clear the message after 3 seconds
    } catch (error) { throw error }

    clearListState();
  }

  const handleAddTodoToList = () => {
    if (inputToDoRef.current?.value) {
      addTodoToTodosState(inputToDoRef.current.value);
      inputToDoRef.current.value = '';
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
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <SuccessMessage
            text={isNew ? successMessage : 'List was updated'}
          />
        </Modal>)
      }

      <BasicFormAreaBG
        maxWidth="1200"
        title={!isNew
          ? (<div ><span className='text-sm' >Update your To-Do List: </span> {listTitle}</div>)
          : (<div className='' >Make a New List of To-Dos</div>)
        }
      >

        <Form method='post' className='mx-8'>

          <div className='vert-space-between-inputs 
            md:grid md:grid-cols-2 md:grid-rows-[1fr_min-content]
            md:gap-x-8
          '>
            <input type="string" name='listId' value={list?.id} hidden readOnly />
            <input type="string" name='projectId' value={projectId} hidden readOnly />

            <div className="form-control gap-6 ">
              <div >
                <InputLabelWithGuideLineLink
                  text='List Title'
                  title='List Title'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a List Title"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <div className='mt-8 mb-5'>  <Divider />   </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  text='Add a To-do'
                  title='To-dos'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a To-Do"
                  ref={inputToDoRef}
                  className=" input-field-text-title "
                />
              </div>

              <div className="flex justify-between items-center pt-0  flex-wrap">
                <div className="checkbox-label-flex">
                  <InputLabel text='Urgent' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isUrgent}
                    onChange={handleIsUrgent}
                  />
                </div>

                <div className=" checkbox-label-flex">
                  <InputLabel text='Important' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isImportant}
                    onChange={handleIsImportant}
                  />
                </div>
              </div>

              <DatePicker
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>

            <div className="col-start-1 row-start-2 vert-space-between-inputs">
              <OutlinedBtn
                text='Add To-Do to List'
                onClickFunction={handleAddTodoToList}
                daisyUIBtnColor='primary'
                type='button'
              />
            </div>


            {/* //? PREVIEW PANEL */}
            <div className="col-start-2 row-start-1 mt-8 md:mt-0 ">
              <div className='pt-3 text-success'>
                <SubHeading14px text='To-Do List Preview' />
              </div>
              <div className={`mt-2 ${listTitle ? 'text-base-content' : 'text-base-content/60'} `}>
                <HeadingH2 text={listTitle || 'List Title'} />
              </div>

              <div className={` ${todos.length ? 'text-base-content' : 'text-base-content/60'}  mt-8`}>
                <SubHeading14px text={`To-Dos`} />
              </div>

              <div className=' max-h-[426px] overflow-auto overflow-x-hidden pt-6'>
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
            <div className="col-start-2 row-start-2 mb-8  vert-space-between-inputs">
              <div className="flex flex-col gap-4">
                <SolidBtn
                  text={saveBtnText}
                  onClickFunction={isNew ? handleSave : handleEdits}
                  icon={dbIcon}
                  daisyUIBtnColor='primary'
                  disableBtn={!isSaveable}
                  type='button'
                />

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
              </div>

            </div>
          </div>
        </Form >
      </BasicFormAreaBG >
      {/* //! ******* End of new form   **************** */}

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

export default TodosListForm