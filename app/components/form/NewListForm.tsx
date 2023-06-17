import React, { useRef, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react';
import { v4 as uuidv4 } from "uuid";

import DatePicker from '~/components/list/DatePicker'
import { useList } from '~/components/list/ListContext';
import { ArrowIcon45deg, ArrowIconUp, closeIcon, dbIcon } from '~/components/utilities/icons';
import Divider from '~/components/utilities/Divider';
import OutlinedBtn from '~/components/buttons/OutlinedBtn';
import SolidBtn from '~/components/buttons/SolidBtn';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
import EditToDoModal from '~/components/modals/EditToDoModal';
import DndTodos from '../dnd/DndTodos';

import type { CreationTodo } from '~/types/listTypes';

function NewListForm() {
  const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();

  const inputToDoRef = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  let disableSaveBtn = !listTitle || todos.length === 0;

  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const fetcher = useFetcher();

  const handleSaveListToDb = async () => {
    const isRecurringString = JSON.stringify(isRecurring);
    const todosString = JSON.stringify(todos);

    try {
      fetcher.submit({
        listTitle,
        isRecurringString,
        todosString,
      }, {
        method: 'POST',
        action: '/dash/todos/new',
      })

      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds

    } catch (error) { throw error }

    setListTitle('')
    setTodos([])
    setIsRecurring(false)
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

  const handleIsRecurring = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRecurring(e.target.checked)
  }


  const updateTodo = (index: number | null, updatedTodo: CreationTodo) => {
    setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };

  function sortTodos(todos: CreationTodo[]): CreationTodo[] {
    todos.sort((a, b) => {
      if (a.urgent && !b.urgent) {
        return -1;
      } else if (!a.urgent && b.urgent) {
        return 1;
      } else if (a.important && !b.important) {
        return -1;
      } else if (!a.important && b.important) {
        return 1;
      } else {
        return 0
      }
    });

    return setTodoSortOrder(todos)
  }

  function setTodoSortOrder(todos: CreationTodo[]): CreationTodo[] {
    return todos.map((todo, index) => {
      return {
        ...todo,
        sortOrder: index,
      }
    })
  }

  return (
    <>
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          {successMessage}
          <SuccessMessage
            text='List was saved'
          />
        </Modal>)
      }
      <div className='
        bg-base-100 
        grid grid-cols-[400px_400px] grid-rows-[72px_1fr_min-content]
        cursor-default
        '>

        {/* //******** TITLES   **************** */}
        {/* //? *****Form Title ******  */}
        <div
          className='
          font-semibold font-nanum text-2xl 
          base-content 
          flex items-center
          mx-8
          '>
          Make a New List of To-Dos
        </div>

        {/* //? *****List Title ******  */}
        {/* grid grid-cols-1 grid-rows-[24px_24px_24px] */}
        <div
          className={`
          bg-base-content 
          flex items-center
          px-8
          font-mont uppercase tracking-[.25em] text-xl
          overflow-hidden 
          truncate text-ellipsis whitespace-nowrap
          // ${!listTitle ? 'text-neutral-content' : ' text-primary-200'}
        `}>
          <div className='truncate text-ellipsis whitespace-nowrap'>
            {listTitle
              ? <> {listTitle}</>
              : <>Enter a title </>
            }
          </div>
        </div>

        {/* //******** BODY   **************** */}
        {/* //? *****Form Inputs ******  */}
        <div className='mx-8'>
          <div> <Divider /> </div>

          <div className="my-8 ">
            <div className="form-control mt-0">
              <label className="label pl-0">
                <span className="label-text text-base font-mont font-semibold">List Title</span>
              </label>
              <input type="text"
                placeholder="Enter a List Title"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                className="
                  input border-none input-secondary 
                  bg-base-200 rounded-none
                  font-poppins font-normal tracking-wide
                  "
              />
              <label className="label min-h-8">
                {!listTitle &&
                  <span className="label-text-alt text-red-700">
                    <div className='flex gap-2'>
                      {ArrowIconUp}
                      A List must have a Title
                    </div>
                  </span>
                }
              </label>
            </div>

            <div className="">
              <label className="cursor-pointer label justify-start pt-0 pl-0" >
                <span className="label-text mr-2 font-mont font-semibold">Recurring List</span>
                <input type="checkbox"
                  className="toggle toggle-secondary"
                  checked={isRecurring}
                  onChange={handleIsRecurring}
                />
              </label>
            </div>

            <div className='my-8'>  <Divider />   </div>

            <div className="form-control mt-0 pt-0 pl-0">
              <label className="label pt-0 pl-0">
                <span className="label-text text-base font-mont font-semibold">Add To-do</span>
              </label>
              <input type="text"
                placeholder="Enter a To-Do"
                ref={inputToDoRef}
                className="input border-none input-secondary  
                  bg-base-200
                  rounded-none
                  font-poppins font-normal tracking-wide
                " />
            </div>

            <div className="flex justify-between items-center pt-0 mt-4 flex-wrap">
              <div className="">
                <label className="cursor-pointer label pl-0 justify-start">
                  <span className="label-text mr-2 font-mont font-semibold">Urgent</span>
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isUrgent}
                    onChange={handleIsUrgent}
                  />
                </label>
              </div>

              <div className="">
                <label className="cursor-pointer label justify-start">
                  <span className="label-text mr-2 font-mont font-semibold">Important</span>
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isImportant}
                    onChange={handleIsImportant}
                  />
                </label>
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
                setTodoSortOrder={setTodoSortOrder}
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
              text={'Save New List'}
              onClickFunction={handleSaveListToDb}
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
      {/* //! ******* End of new form   **************** */}

      {isEditToDoModalOpen && (
        <>
          <EditToDoModal
            todo={selectedTodo}
            setIsEditToDoModalOpen={setIsEditToDoModalOpen}
            todos={todos}
            updateTodo={updateTodo}
            index={selectedTodoIndex}
          />
        </>
      )}

    </>
  )
}

export default NewListForm