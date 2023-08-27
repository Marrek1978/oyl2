import type { RoutineToDo } from '@prisma/client'

type Props = {
  routineObject: RoutineToDo
}

function RoutineToDoItem({ routineObject }: Props) {
  return (
    <>
      <div
        className={` 
          flex w-full items-center content-center
          p-0 m-0
          text-left 
          font-poppins para-color
          `}>
        <div className={` wrap truncate text-ellipsis	${routineObject.complete && 'line-through text-slate-300'}`} >
          {routineObject.body}
        </div>
      </div>
    </>
  )
}

export default RoutineToDoItem