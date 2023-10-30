import { v4 as uuidRoutines } from "uuid";
import { useEffect, useMemo, useState } from 'react'
import { Form, useFetcher, useParams } from '@remix-run/react';

import Divider from '~/components/utilities/Divider';
import HeadingH2 from '~/components/titles/HeadingH2';
import FormButtons from "~/components/forms/FormButtons";
import DndTasks from '~/components/dnds/routines/DndTasks';
import BtnWithProps from "~/components/buttons/BtnWithProps";
import EditTaskModal from '~/components/modals/EditTaskModal';
import { ArrowIcon45deg } from '~/components/utilities/icons';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useServerMessages from "~/components/modals/useServerMessages";
import { DesireOutcomeGuideline } from '~/components/utilities/Guidelines';
import useGetNavigationState from "~/components/utilities/useNavigationState";
import { resetTasksSortOrder } from '~/components/utilities/helperFunctions';
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

  const [title, setTitle] = useState<string>('');
  const [taskText, setTaskText] = useState<string>(''); // matches todoItem
  const [tasks, setTasks] = useState<CreationTask[]>([])
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [routineId, setRoutineId] = useState<string>('')
  const [outcomeId, setOutcomeId] = useState<string>('')
  const [isAddable, setIsAddable] = useState<boolean>(false)
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CreationTask | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);


  const { isIdle, navigationState } = useGetNavigationState()
  useServerMessages({ fetcherState: navigationState, isShowFailed: true })

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Routine')
  const headerTxt = useMemo(() => headerText(isNew, 'Routine', routine?.title || ''), [isNew, routine?.title])


  useEffect(() => {
    setTitle(routine?.title || '');
    setTasks(routine?.tasks || []);
    setRoutineId(routine?.id || '')
    setSortOrder(routine?.sortOrder || nextSortOrder || 0)
    setOutcomeId(routine?.outcomeId || params.outcomeId || '')
  }, [routine, params, nextSortOrder])


  useEffect(() => {
    const isInputEmpty = !title || tasks.length === 0
    const isInputDifferent = title !== routine?.title || tasks !== routine?.tasks
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [isNew, tasks, title, routine, isIdle])



  useEffect(() => {
    const isInputEmpty = !taskText
    setIsAddable(!isInputEmpty)
  }, [taskText])



  const handleSave = async () => {
    console.log('saving routine')

    const tasksString = JSON.stringify(tasks);

    try {
      fetcher.submit({
        title,
        tasksString,
        outcomeId,
        sortOrder,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearRoutineState();
  }


  const handleEdit = async () => {
    console.log('editing routine')

    const tasksString = JSON.stringify(tasks);
    try {
      fetcher.submit({
        id: routineId,
        title,
        tasksString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    clearRoutineState();
  }


  const clearRoutineState = () => {
    setTitle('')
    setTasks([])
  }


  const handleAddTaskToRoutine = () => {
    if (taskText) {
      addTaskToTasksArray();
      setTaskText('');
    }
  }

  const addTaskToTasksArray = () => {
    const id = uuidRoutines();
    const newTask: CreationTask = {
      id,
      body: taskText,
      isComplete: false,
      sortOrder: tasks.length,
    }
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  };


  const updateTask = (index: number | null, updatedTask: CreationTask) => {
    setTasks(tasks.map((task, i) => (i === index ? updatedTask : task)));
  };


  return (
    <>
      <BasicFormAreaBG h2Text={headerTxt}  >
        <Form method='post' className='  form-control gap-y-4 p-8'>
          <input type="string" name='routineId' value={routineId} hidden readOnly />
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
                  inputTitle='Add a Task'
                  guideLineTitle='Tasks'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a Task"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>

              <BtnWithProps
                btnPurpose={'save'}
                isOutlined={true}
                btnLabel={'Add Task to Routine'}
                icon={ArrowIcon45deg}
                isBtnDisabled={!isAddable}
                onClickFunction={handleAddTaskToRoutine}
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
                  <DndTasks
                    setTasks={setTasks}
                    tasks={tasks}
                    setTaskSortOrder={resetTasksSortOrder}
                    setIsEditTaskModalOpen={setIsEditTaskModalOpen}
                    setSelectedTaskIndex={setSelectedTaskIndex}
                    setSelectedTask={setSelectedTask} />
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

        </Form>
      </BasicFormAreaBG>

      {isEditTaskModalOpen && (
        <EditTaskModal
          task={selectedTask}
          setIsEditTaskModalOpen={setIsEditTaskModalOpen}
          updateTask={updateTask}
          index={selectedTaskIndex}
        />
      )}
    </>
  )
}

export default RoutineForm

