import { useState } from 'react'

import TextBtn from '../buttons/TextBtn'
import { EditIcon } from '../utilities/icons'

import Modal from '../modals/Modal'
import RoutineTodosCompletedForm from '../forms/CompletedTasksForm'

import type { RoutineAndToDos } from '~/types/routineTypes'


type Props = {
  routines: RoutineAndToDos[]
}

function RoutinesDisplayToday({ routines }: Props) {

  const [routine, setRoutine] = useState<RoutineAndToDos>()
  const [openTodosCompleteModal, setOpenTodosCompleteModal] = useState<boolean>(false)

  const handleClick = (routineId: string) => {
    const routineToOpen = routines.find(routine => routine.id === routineId)
    setRoutine(routineToOpen)
    setOpenTodosCompleteModal(true)
  };

  return (
    <>
      {openTodosCompleteModal && routine && (
        <Modal onClose={() => { }} zIndex={10}  >
          <RoutineTodosCompletedForm routine={routine} />
        </Modal>
      )}

      <div className=''>
        {routines.map((routine) => (
          <div
            key={routine.id}
            className='text-primary'
            onClick={() => handleClick(routine.id)}
          >
            <TextBtn
              text={routine.title}
              onClickFunction={() => { }}
              icon={EditIcon}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default RoutinesDisplayToday