import { v4 as uuidRoutines } from "uuid";
import React, { useEffect, useRef, useState } from 'react'
import { Form, Link, useFetcher, useLocation, useNavigation, useParams } from '@remix-run/react';

import Modal from '../modals/Modal';
import SolidBtn from '../buttons/SolidBtn';
import Divider from '../utilities/Divider';
import HeadingH2 from '../titles/HeadingH2';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SubHeading14px from '../titles/SubHeading14px';
import SuccessMessage from '../modals/SuccessMessage';
import { closeIcon, dbIcon } from '../utilities/icons';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import DndRoutineToDos from '../dnds/routines/DndRoutineToDos';
import { DesireOutcomeGuideline } from '../utilities/Guidelines';
import EditRoutineToDoModal from '../modals/EditRoutineToDoModal';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { resetRoutineTodosSortOrder } from '../utilities/helperFunctions';

import type { CreationRoutineToDo, RoutineAndToDos } from '~/types/routineTypes'

interface RoutinesFormProps {
  routine?: RoutineAndToDos
}

function RoutinesForm({ routine }: RoutinesFormProps) {

  const fetcher = useFetcher();
  const location = useLocation();
  const navigation = useNavigation();
  const inputToDoRef = useRef<HTMLInputElement>(null);
  const { projectId, desireOutcomeId } = useParams()

  const [isSaveable, setIsSaveable] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [routineTitle, setRoutineTitle] = useState<string>('');
  const [todos, setTodos] = useState<CreationRoutineToDo[]>([]);
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<CreationRoutineToDo | null>(null);

  const pathArray = location.pathname.split('/')
  const isNew = pathArray[pathArray.length - 1] === 'new'

  const isSubmitting = navigation.state === 'submitting'
  const isIdle = navigation.state === 'idle'


  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNew
        ? "Save New List"
        : "Save Changes"


  useEffect(() => {
    if (fetcher.data) {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 1000);
    }
  }, [fetcher])


  useEffect(() => {
    if (routine) {
      setRoutineTitle(routine.title);
      setTodos(routine.routineToDos);
    }
  }, [routine])


  useEffect(() => {
    let saveable =
      isNew
        ? (routineTitle && todos.length > 0) ? true : false
        : (routineTitle !== routine?.title || todos !== routine?.routineToDos) ? true : false
    setIsSaveable(saveable)
  }, [isNew, todos, routineTitle, routine, isIdle])


  const handleSave = async () => {
    const routineToDosString = JSON.stringify(todos);
    const projectIdNum = projectId ? projectId : null
    const outcomeIdNum = desireOutcomeId ? desireOutcomeId : null

    try {
      fetcher.submit({
        routineTitle,
        routineToDosString,
        projectIdNum,
        outcomeIdNum,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearRoutineState();
  }


  const clearRoutineState = () => {
    setRoutineTitle('')
    setTodos([])
  }


  const handleEdit = async () => {
    const editedRoutine = { ...routine, title: routineTitle, todos }
    const editedRoutineString = JSON.stringify(editedRoutine);
    try {
      fetcher.submit({
        editedRoutineString
      }, {
        method: 'PUT',
      })
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
    const id = uuidRoutines();
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
          <SuccessMessage
            text={successMessage}
          />
        </Modal>)
      }


      <BasicFormAreaBG
        maxWidth="1200"
        title={isNew ? (<div className='' >Make a New Routine</div>)
          : (<div ><span className='text-sm' >Update your Routine: </span> {routineTitle}</div>)
        }
      >
        <Form method='post' className='mx-8'>
          <div className='vert-space-between-inputs 
            md:grid md:grid-cols-2 md:grid-rows-[1fr_min-content]
            md:gap-x-8
          '>
            <input type="string" name='listId' value={routine?.id} hidden readOnly />
            <input type="string" name='projectId' value={projectId} hidden readOnly />
            <input type='string' name='outcomeId' value={desireOutcomeId} hidden readOnly />

            <div className="form-control gap-6 ">
              <div >
                <InputLabelWithGuideLineLink
                  text='Routine Title'
                  title='Routine Title'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a Routine Title"
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
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
                <SubHeading14px text='Routine List Preview' />
              </div>
              <div className={`mt-2 ${routineTitle ? 'text-base-content' : 'text-base-content/60'} `}>
                <HeadingH2 text={routineTitle || 'Routine Title'} />
              </div>
              <div className={` ${todos.length ? 'text-base-content' : 'text-base-content/60'}  mt-8`}>
                <SubHeading14px text={`To-Dos`} />
              </div>

              <div className=' max-h-[426px] overflow-auto overflow-x-hidden pt-6'>
                <DndRoutineToDos
                  setTodos={setTodos}
                  todos={todos}
                  setTodoSortOrder={resetRoutineTodosSortOrder}
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
                  onClickFunction={isNew ? handleSave : handleEdit}
                  icon={dbIcon}
                  daisyUIBtnColor='primary'
                  disableBtn={!isSaveable}
                  type='button'
                />

                <Link to='..'>
                  <SolidBtnGreyBlue
                    text={routineTitle || todos.length > 0
                      ? ('Close without Saving')
                      : ('Close')}
                    onClickFunction={() => { }}
                    icon={closeIcon}
                  />
                </Link>

                {!isNew && (
                  <Link to='../delete'>
                    <OutlinedBtn
                      text='Delete Routine'
                      onClickFunction={() => { }}
                      daisyUIBtnColor='error'
                    />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </Form>
      </BasicFormAreaBG>


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

