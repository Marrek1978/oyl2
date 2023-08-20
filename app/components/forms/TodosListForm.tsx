import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from 'react'
import { Form, useFetcher, useNavigate } from '@remix-run/react';


import InputLabel from './InputLabel';
import Modal from '~/components/modals/Modal';
import SolidBtn from '~/components/buttons/SolidBtn';
import Divider from '~/components/utilities/Divider';
import DatePicker from '~/components/list/DatePicker';
import DndTodos from '~/components/dnds/todos/DndTodos';
import LargeFormWithHeader from './LargeFormWithHeader';
// import { useList } from '~/components/list/ListContext';
import OutlinedBtn from '~/components/buttons/OutlinedBtn';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import EditListToDoModal from '~/components/modals/EditListToDoModal';
import { sortTodos, resetTodoSortOrder } from '~/components/utilities/helperFunctions';
import { ArrowIcon45deg, ArrowIconUp, closeIcon, dbIcon } from '~/components/utilities/icons';

import type { CreationTodo, ListAndToDos } from '~/types/listTypes';

interface TodosListFormProps {
  list?: ListAndToDos;
}

function TodosListForm({ list }: TodosListFormProps) {

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const inputToDoRef = useRef<HTMLInputElement>(null);

  // const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();
  const [todos, setTodos] = useState<CreationTodo[]>([]);
  const [listTitle, setListTitle] = useState<string>('');

  const [isEditingTodoList, setIsEditingTodoList] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);

  let disableSaveBtn = !listTitle || todos.length === 0;

  useEffect(() => {
    if (list) {
      setListTitle(list.title);
      setTodos(list.todos);
      setIsEditingTodoList(true);
    }
  }, [list])


  const handleCreateListInDb = async () => {
    const todosString = JSON.stringify(todos);

    try {
      fetcher.submit({
        listTitle,
        todosString
      }, {
        method: 'POST',
        action: '/dash/todos/new',
      })

      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
    } catch (error) { throw error }

    clearListState();
  }

  const clearListState = () => {

    setListTitle('')
    setTodos([])
  }

  const handleSaveListEditsToDb = async () => {
    const editedList = { ...list, title: listTitle, todos }
    const editedListString = JSON.stringify(editedList);

    try {
      fetcher.submit({
        editedListString
      }, {
        method: 'PUT',
        action: '/dash/todos/$listId/edit',
      })

      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
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
          {successMessage}
          <SuccessMessage
            text={isEditingTodoList ? 'List was saved' : 'List was updated'}
          />
        </Modal>)
      }


      <LargeFormWithHeader
        title={isEditingTodoList
          ? (<div ><span className='text-sm' >Update your To-Do List: </span> {listTitle}</div>)
          : (<div className='' >Make a New List of To-Dos</div>)
        }
      >

        <Form method='post' className='mx-8'>

          <div className=' 
            bg-base-100 
            md:grid md:grid-cols-2 grid-rows-[1fr_min-content]
            cursor-default 
            gap-x-12 gap-y-8
            form-control vert-space-between-inputs
            max-h-full
            overflow-auto
          '>
            <div className="col-start-1 row-start-1">
              <div className="form-control gap-6 ">
                <input type="string" name='listId' value={list?.id} hidden readOnly />


                {/* //******** BODY   **************** */}
                {/* //? *****Form Inputs ******  */}
                <div className='mx-8'>
                  <div> <Divider /> </div>

                  <div className="mt-4 mb-8 ">
                    <div className="form-control mt-0">
                      <InputLabel text='List Title' />
                      <input type="text"
                        placeholder="Enter a List Title"
                        value={listTitle}
                        onChange={(e) => setListTitle(e.target.value)}
                        className=" input-field-text-title "
                      />
                      <label className="label min-h-8">
                        {!listTitle && (
                          <div className=' flex gap-4 validation-error'>
                            {ArrowIconUp} A List must have a Title
                          </div>
                        )
                        }
                      </label>
                    </div>

                    <div className='my-8'>  <Divider />   </div>

                    <div className="form-control mt-0 pt-0 pl-0">
                      <InputLabel text='Add To-do' />
                      <input type="text"
                        placeholder="Enter a To-Do"
                        ref={inputToDoRef}
                        className='input-field-text-title'
                      />
                    </div>

                    <div className="flex justify-between items-center pt-0 mt-4 flex-wrap">
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

                    <div className="mt-4" >
                      <DatePicker
                        setSelectedDate={setSelectedDate}
                        selectedDate={selectedDate}
                      />
                    </div>
                  </div>
                </div>

                {/* //? *****Editable List of Todos Inputs ******  */}
                <div className=''>
                  <div className='flex flex-col justify-between px-6 m-auto '>
                    <div className='min-h-[426px] max-h-[426px] overflow-auto overflow-x-hidden pt-6'>
                      <DndTodos
                        setTodos={setTodos}
                        todos={todos}
                        setTodoSortOrder={resetTodoSortOrder}
                        setIsEditToDoModalOpen={setIsEditToDoModalOpen}
                        setSelectedTodoIndex={setSelectedTodoIndex}
                        setSelectedTodo={setSelectedTodo} />
                    </div>
                  </div>
                </div>

                {/* //******** BUTTONS   **************** */}
                {/* //? *****form buttons ******  */}
                <div className='mx-8 '>
                  <OutlinedBtn
                    text='Add to List'
                    onClickFunction={handleAddTodoToList}
                    icon={ArrowIcon45deg}
                    daisyUIBtnColor='primary'
                  />
                </div>

                {/* //? *****list buttons ******  */}

                <div className='mx-8'>
                  <div className=''>
                    <SolidBtn
                      text={isEditingTodoList ? 'Save Updates to List' : 'Save New List'}
                      onClickFunction={isEditingTodoList ? handleSaveListEditsToDb : handleCreateListInDb}
                      icon={dbIcon}
                      daisyUIBtnColor='primary'
                      disableSaveBtn={disableSaveBtn}
                    />
                  </div>

                  <div className=' my-6 '>
                    <SolidBtnGreyBlue
                      text={listTitle || todos.length > 0
                        ? ('Close without Saving')
                        : ('Close')}
                      onClickFunction={() => navigate('/dash/todos')}
                      icon={closeIcon}
                    />
                  </div>
                </div>
              </div>
              </div>
              </div>
            </Form>
          </LargeFormWithHeader >
          {/* //! ******* End of new form   **************** */}

          {
            isEditToDoModalOpen && (
              <>
                <EditListToDoModal
                  todo={selectedTodo}
                  setIsEditToDoModalOpen={setIsEditToDoModalOpen}
                  todos={todos}
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