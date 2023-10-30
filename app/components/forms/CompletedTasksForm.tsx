import type { Task } from '@prisma/client';
import { useEffect, useState } from 'react'
import { useMatches } from '@remix-run/react';

import FormButtons from './FormButtons';
import BasicFormAreaBG from './BasicFormAreaBG';
import TaskWithCompletedBox from '../routines/TaskWithCompletedBox';

import type { RoutineAndTasks } from '~/types/routineTypes'
import { sortTasks } from '../utilities/helperFunctions';

interface CompletedTasksFormProps {
  routine: RoutineAndTasks
}

function CompletedTasksForm({ routine }: CompletedTasksFormProps) {

  const matches = useMatches()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isShowCloseBtn, setIsShowCloseBtn] = useState<boolean>(true)
  const [isDisableAllBtns, setIsDisableAllBtns] = useState<boolean>(false)

  useEffect(() => {
    matches.find((match => match.id === 'routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.routines.$routineId'))
      && setIsShowCloseBtn(false)
  }, [matches])


  useEffect(() => {
    if (!routine.tasks) return
    const properlySortedTasks = sortTasks(routine.tasks);
    setTasks(properlySortedTasks)
  }, [routine.tasks])


  return (
    <>
      <BasicFormAreaBG
        h2Text={routine.title}
        linkDestination='edit'
        linkText='EDIT ROUTINE'
        linkColorDaisyUI='info'
      >
        <div className='p-8  form-control gap-y-6  '>
          <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto  ">
            {tasks.map((task, index) => {
              return (
                <TaskWithCompletedBox
                  key={task.id}
                  task={task}
                  setIsDisableAllBtns={setIsDisableAllBtns}
                  isDisableAllBtns={isDisableAllBtns}
                />
              )
            })}
          </div>

          <FormButtons
            isNew={false}
            isShowSaveBtn={false}
            isShowCloseBtn={isShowCloseBtn}
            deleteBtnText='Delete Routine'
            deleteBtnLink='edit/delete'
          />
        </div>
      </BasicFormAreaBG>
    </>
  )
}

export default CompletedTasksForm

