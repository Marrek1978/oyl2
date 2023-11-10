import { useEffect, useState } from 'react'

import TodosCompletedForm from '../forms/CompletedTodosForm'
import RoutineTodosCompletedForm from '../forms/CompletedTasksForm'

import type { ScheduledItem } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes'
import type { DraggedItemDescription } from '~/types/schedulerTypes'


type Props = {
  event: ScheduledItem
  loadedLists: ListAndToDos[]
  loadedRoutines: RoutineAndTasks[]
  loadedDesiresAndAll: DesireWithOutcomesAndAll[]
}

function DisplayCurrentEvent({ event, loadedRoutines, loadedLists, loadedDesiresAndAll }: Props) {
  console.log("🚀 ~ file: DisplayCurrentEvent.tsx:20 ~ DisplayCurrentEvent ~ event:", event)

  const [type, setType] = useState<string>()
  const [output, setOutput] = useState<JSX.Element>()

  const description = event.description as DraggedItemDescription

  // This would be correct
  useEffect(() => {
    if (typeof description === 'object' && description !== null && 'type' in description) {
      setType(description.type)
    }
  }, [description])




  if (type === 'list') {
    const toDosList = loadedLists.find((loadedList) => loadedList.id === event.itemId)
    if (toDosList === undefined) return
    const result = (<><div> < TodosCompletedForm list={toDosList} /></div></>)
    setOutput(result)
  }
  // if (type === 'routine') { }
  // if (type === 'outcome') {
  //   if (description.subType === 'list') { }
  //   if (description.subType === 'routine') { }
  // }
  // if (type === 'timeblock') {}

  // console.log('in useEffect and typeOfEvent is: ', typeOfEvent)
  // if (typeOfEvent === 'listId') {
  //   const toDosList = loadedLists.find((loadedList) => loadedList.id === event.itemId)
  //   if (toDosList === undefined) return
  //   const result = (<><div> < TodosCompletedForm list={toDosList} /></div></>)
  //   setOutput(result)
  //   return
  // }

  // if (typeOfEvent === 'routineId') {
  //   const routine = loadedRoutines.find((loadedRoutine) => loadedRoutine.id === event.itemId)
  //   if (routine === undefined) return
  //   const result = (<><div> < RoutineTodosCompletedForm routine={routine} /></div></>)
  //   setOutput(result)
  //   return
  // }

  // if (typeOfEvent === 'outcomeId') {
  //   const result = (<><div>Outcome Time Block</div></>)
  //   setOutput(result)
  //   return
  // sort listAndDotos[] by sortOrder
  // display list of lists
  // display completed checkbox form for clicked list
  // }



  return (
    <>

      {output}






    </>
  )
}

export default DisplayCurrentEvent