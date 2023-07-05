import React, { useEffect, useRef, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react';
import { v4 as uuidv42 } from "uuid";


import SolidBtn from '../buttons/SolidBtn';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import Divider from '../utilities/Divider';
import { ArrowIcon45deg, ArrowIconUp, closeIcon, dbIcon } from '../utilities/icons';
import Modal from '../modals/Modal';
import SuccessMessage from '../modals/SuccessMessage';

import type { CreationRoutineToDo, RoutineAndToDos } from '~/types/routineTypes'
import DndRoutineToDos from '../dnds/routines/DndRoutineToDos';
import { resetRoutineTodosSortOrder } from '../utilities/helperFunctions';
import EditRoutineToDoModal from '../modals/EditRoutineToDoModal';

interface RoutinesFormProps {
  routine?: RoutineAndToDos
}

function RoutinesForm({ routine }: RoutinesFormProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const inputToDoRef = useRef<HTMLInputElement>(null);

  // const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();
  const [todos, setTodos] = useState<CreationRoutineToDo[]>([]);
  const [routineTitle, setRoutineTitle] = useState<string>('');
  const [isEditingTodoList, setIsEditingTodoList] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<CreationRoutineToDo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);

  let disableSaveBtn = !routineTitle || !todos;

  useEffect(() => {
    if (routine) {
      setRoutineTitle(routine.title);
      setTodos(routine.routineToDos);
      setIsEditingTodoList(true);
    }
  }, [routine])


  const handleCreateRoutineAndToDosInDb = async () => {
    const routineToDosString = JSON.stringify(todos);

    try {
      fetcher.submit({
        routineTitle,
        routineToDosString
      }, {
        method: 'POST',
        action: '/dash/routines/new',
      })

      setSuccessMessage('New Routine was saved');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
    } catch (error) { throw error }

    clearRoutineState();
  }

  const clearRoutineState = () => {
    setRoutineTitle('')
    setTodos([])
  }

  const handleSaveRoutineEditsToDb = async () => {
    const editedRoutine = { ...routine, title: routineTitle, todos }
    const editedRoutineString = JSON.stringify(editedRoutine);
    try {
      fetcher.submit({
        editedRoutineString
      }, {
        method: 'PUT',
        action: '/dash/routines/$routineId/edit',
      })

      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 1000); // Clear the message after 3 seconds
    } catch (error) { throw error }

    clearRoutineState();
  }

  const handleAddTodoToList = () => {
    if (inputToDoRef.current?.value) {
      addTodoToTodosState(inputToDoRef.current.value);
      inputToDoRef.current.value = '';
    }
  }

  const addTodoToTodosState = (newTodo: string) => {
    const id = uuidv42();
    const todo: CreationRoutineToDo = {
      id,
      body: newTodo,
      complete: false,
      sortOrder: todos.length,
    }
    setTodos(prevTodos => {
      return [...prevTodos, todo];
    });
  };


  const updateTodo = (index: number | null, updatedTodo: CreationRoutineToDo) => {
    setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };

  return (
    <>
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          {successMessage}
          <SuccessMessage
            text={isEditingTodoList ? 'Routine was saved' : 'Routine was updated'}
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
          {isEditingTodoList ? 'Update your Routine' : 'Make a New Routine'}
        </div>

        {/* //? *****List Title ******  */}
        <div
          className={`
          bg-base-content 
          flex items-center
          px-8
          font-mont uppercase tracking-[.25em] text-xl
          overflow-hidden 
          truncate text-ellipsis whitespace-nowrap
          // ${!routineTitle ? 'text-neutral-content' : ' text-primary-200'}
        `}>
          <div className='truncate text-ellipsis whitespace-nowrap'>
            {routineTitle
              ? <> {routineTitle}</>
              : <>Enter a title </>
            }
          </div>
        </div>

        {/* //******** BODY   **************** */}
        {/* //? *****Form Inputs ******  */}
        <div className='mx-8'>
          <div> <Divider /> </div>

          <div className="mt-4 mb-8 ">
            <div className="form-control mt-0">
              <label className="label pl-0">
                <span className="label-text text-base font-mont font-semibold">List Title</span>
              </label>
              <input type="text"
                placeholder="Enter a List Title"
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
                className="
                  input border-none input-secondary 
                  bg-base-200 rounded-none
                  font-poppins font-normal tracking-wide
                  "
              />
              <label className="label min-h-8">
                {!routineTitle &&
                  <span className="label-text-alt text-red-700">
                    <div className='flex gap-2'>
                      {ArrowIconUp}
                      A List must have a Title
                    </div>
                  </span>
                }
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

          </div>
        </div>

        {/* //? *****Editable List of Todos Inputs ******  */}
        <div className=''>
          <div className='flex flex-col justify-between px-6 m-auto '>
            <div className='min-h-[426px] max-h-[426px] overflow-auto overflow-x-hidden pt-6'>
              <DndRoutineToDos
                setTodos={setTodos}
                todos={todos}
                setTodoSortOrder={resetRoutineTodosSortOrder}
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
              text={isEditingTodoList ? 'Save Updates to Routine' : 'Save New Routine'}
              onClickFunction={isEditingTodoList ? handleSaveRoutineEditsToDb : handleCreateRoutineAndToDosInDb}
              icon={dbIcon}
              daisyUIBtnColor='primary'
              disableSaveBtn={disableSaveBtn}
            />
          </div>

          <div className=' my-6 '>
            <SolidBtnGreyBlue
              text={routineTitle || todos.length > 0
                ? ('Close without Saving')
                : ('Close')}
              onClickFunction={() => navigate('/dash/routines')}
              icon={closeIcon}
            />
          </div>
        </div>
      </div>
      {/* //! ******* End of new form   **************** */}

      {isEditToDoModalOpen && (
        <>
          <EditRoutineToDoModal
            todo={selectedTodo}
            setIsEditRoutineToDoModalOpen={setIsEditToDoModalOpen}
            updateRoutineToDo={updateTodo}
            index={selectedTodoIndex}
          />
        </>
      )}
    </>
  )
}

export default RoutinesForm

