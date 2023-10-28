import { v4 as uuidRoutines } from "uuid";
import { useEffect, useMemo, useState } from 'react'
import { Form, useFetcher, useParams } from '@remix-run/react';

import Divider from '~/components/utilities/Divider';
import HeadingH2 from '~/components/titles/HeadingH2';
import FormButtons from "~/components/forms/FormButtons";
import BtnWithProps from "~/components/buttons/BtnWithProps";
import { ArrowIcon45deg } from '~/components/utilities/icons';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useServerMessages from "~/components/modals/useServerMessages";
import DndRoutineToDos from '~/components/dnds/routines/DndTasks';
import { DesireOutcomeGuideline } from '~/components/utilities/Guidelines';
import EditRoutineToDoModal from '~/components/modals/EditRoutineToDoModal';
import useGetNavigationState from "~/components/utilities/useNavigationState";
import { resetRoutineTodosSortOrder } from '~/components/utilities/helperFunctions';
import { headerText, useSaveBtnText } from "~/components/forms/FormsCommonFunctions";
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';

import type { CreationTask, RoutineAndTasks } from '~/types/routineTypes'


interface RoutinesFormProps {
  routine?: RoutineAndTasks
  isNew?: boolean
  nextSortOrder?: number
}

function RoutineForm({ routine, isNew = true, nextSortOrder }: RoutinesFormProps) {

  const params = useParams()
  const fetcher = useFetcher();

  const [routineTodo, setRoutineTodo] = useState<string>(''); // matches todoItem
  const [routineTodos, setRoutineTodos] = useState<CreationTask[]>([])
  console.log("🚀 ~ file: RoutineForm.tsx:40 ~ RoutineForm ~ routineTodos:", routineTodos)
  const [title, setTitle] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [routineId, setRoutineId] = useState<string>('')
  const [outcomeId, setOutcomeId] = useState<string>('')
  const [selectedRoutineTodo, setSelectedRoutineTodo] = useState<CreationTask | null>(null);

  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isAddable, setIsAddable] = useState<boolean>(false)
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);


  const { isIdle, navigationState } = useGetNavigationState()
  useServerMessages({ fetcherState: navigationState, isShowFailed: true })

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Routine')
  const headerTxt = useMemo(() => headerText(isNew, 'Routine', routine?.title || ''), [isNew, routine?.title])




  useEffect(() => {
    if (routine) {
      setTitle(routine?.title || '');
      setRoutineTodos(routine.tasks || []);
      setRoutineId(routine?.id || '')
      setSortOrder(routine?.sortOrder || nextSortOrder || 0)
      setOutcomeId(routine?.outcomeId || params.outcomeId || '')
    }
  }, [routine, params, nextSortOrder])


  useEffect(() => {
    const isInputEmpty = !title || routineTodos.length === 0
    const isInputDifferent = title !== routine?.title || routineTodos !== routine?.tasks
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [isNew, routineTodos, title, routine, isIdle])



  useEffect(() => {
    const isInputEmpty = !routineTodo
    setIsAddable(!isInputEmpty)
  }, [routineTodo])



  const handleSave = async () => {
    const routineTodosString = JSON.stringify(routineTodos);

    try {
      fetcher.submit({
        title,
        routineTodosString,
        outcomeId,
        sortOrder,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearRoutineState();
  }


  const handleEdit = async () => {
    const routineTodosString = JSON.stringify(routineTodos);
    try {
      fetcher.submit({
        id: routineId,
        title,
        routineTodosString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    clearRoutineState();
  }


  const clearRoutineState = () => {
    setTitle('')
    setRoutineTodos([])
  }


  const handleAddTodoToRoutineArray = () => {
    console.log('adding to ')

    if (routineTodo) {
      addTodoToRoutineTodosArray(routineTodo);
    }
  }

  const addTodoToRoutineTodosArray = (newRoutineTodo: string) => {
    const id = uuidRoutines();
    const todo: CreationTask = {
      id,
      body: routineTodo,
      complete: false,
      sortOrder: routineTodos.length,
    }
    setRoutineTodos(prevRoutineTodos => {
      return [...prevRoutineTodos, todo];
    });
  };


  const updateTodo = (index: number | null, updatedTodo: CreationTask) => {
    setRoutineTodos(routineTodos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };


  return (
    <>
      <BasicFormAreaBG h2Text={headerTxt}  >
        <Form method='post' className='  form-control gap-y-4 p-8'>
          <input type="string" name='listId' value={routineId} hidden readOnly />
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type='string' name='outcomeId' value={outcomeId} hidden readOnly />

          <div className=' flex gap-12 flex-wrap'>
            <div className="flex-1 form-control gap-y-8 ">
              <div >
                <InputLabelWithGuideLineLink
                  inputTitle='Routine Title'
                  guideLineTitle='Routine Title'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a Routine Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <div className='mt-4'>  <Divider />   </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  inputTitle='Add a To-do'
                  guideLineTitle='To-dos'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a Routine To-Do"
                  value={routineTodo}
                  onChange={(e) => setRoutineTodo(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <BtnWithProps
                btnPurpose={'save'}
                isOutlined={true}
                btnLabel={'Add to Routine'}
                icon={ArrowIcon45deg}
                isBtnDisabled={!isAddable}
                onClickFunction={handleAddTodoToRoutineArray}
              />
            </div>


            {/* //? PREVIEW PANEL */}
            <div className="flex-1 form-control gap-y-6 justify-between">
              <div>
                <div className='mt-1 text-success'>
                  <SubHeading14px text='Preview' />
                </div>
                <div className={`mt-2 truncate max-w-sm capitalize ${title ? 'text-base-content' : 'text-base-content/60'} `}>
                  <HeadingH2 text={title || 'Routine Title'} />
                </div>

                <div className=' max-h-[360px] overflow-auto overflow-x-hidden mt-4 pr-2'>

                  <DndRoutineToDos
                    setTodos={setRoutineTodos}
                    todos={routineTodos}
                    setTodoSortOrder={resetRoutineTodosSortOrder}
                    setIsEditToDoModalOpen={setIsEditToDoModalOpen}
                    setSelectedTodoIndex={setSelectedTodoIndex}
                    setSelectedTodo={setSelectedRoutineTodo} />
                </div>
              </div>

              {/* //******** BUTTONS   **************** */}
              <div className=" justify-end  ">
                <BtnWithProps
                  btnPurpose={'save'}
                  btnLabel={saveBtnTxt}
                  isBtnDisabled={!isSaveable || !isIdle}
                  onClickFunction={isNew ? handleSave : handleEdit}
                />
              </div>
            </div>
          </div>


          {!isNew && (

            <FormButtons
              isShowSaveBtn={false}
              isNew={isNew}
              isShowCloseBtn={!isNew}
              saveBtnOnClickFunction={isNew ? handleSave : handleEdit}
              saveBtnType={'button'}
              deleteBtnText={'Delete Routine'}
              flexXGap={'12'}
            />
          )}


          {/* <Link to='..'>
                    <SolidBtnGreyBlue
                      text={title || routineTodos.length > 0
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
          </div> */}

        </Form>
      </BasicFormAreaBG>


      {isEditToDoModalOpen && (
        <>
          <EditRoutineToDoModal
            todo={selectedRoutineTodo}
            setIsEditRoutineToDoModalOpen={setIsEditToDoModalOpen}
            updateRoutineToDo={updateTodo}
            index={selectedTodoIndex}
          />
        </>
      )}
    </>
  )
}

export default RoutineForm

