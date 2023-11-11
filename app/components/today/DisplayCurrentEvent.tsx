import { useEffect, useState } from 'react'

import CompletedTodosForm from '../forms/CompletedTodosForm'
// import RoutineTodosCompletedForm from '../forms/CompletedTasksForm'

import type { ScheduledItem } from '@prisma/client'
import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes'
import type { DraggedItemDescription } from '~/types/schedulerTypes'
import CompletedTasksForm from '../forms/CompletedTasksForm'
import { GetCurrentListById, GetOutcomeByIdFromDesiresArray } from '../schedule/Scheduler'
import OutcomeListsDisplay from './OutcomeListsDisplay'


type Props = {
  event: ScheduledItem
  loadedLists: ListAndToDos[]
  loadedRoutines: RoutineAndTasks[]
  loadedDesiresAndAll: DesireWithOutcomesAndAll[]
}

function DisplayCurrentEvent({ event, loadedRoutines, loadedLists, loadedDesiresAndAll }: Props) {
  const [output, setOutput] = useState<JSX.Element>()
  const description = event.description as DraggedItemDescription

  // This would be correct
  useEffect(() => {
    if (typeof description === 'object' && description !== null && 'type' in description) {
      const type = description.type

      if (type === 'list') {
        const currentList = loadedLists.find((list) => list.id === event.itemId)
        const result = ReturnCompletedTodosForm(currentList)
        setOutput(result)
      }
      if (type === 'routine') {
        const currentRoutine = loadedRoutines.find((routine) => routine.id === event.itemId)
        const result = ReturnCompletedTasksForm(currentRoutine)
        setOutput(result)
      }

      if (type === 'outcome') {
        if (description.subType === 'list') {
          const outcome = GetOutcomeByIdFromDesiresArray(loadedDesiresAndAll, description.outcomeId)
          const currentList:ListAndToDos[] = GetCurrentListById(description.itemId, outcome[0].lists) as ListAndToDos[]
          const result = ReturnCompletedTodosForm(currentList[0])
          setOutput(result)
        }
        if (description.subType === 'routine') {
          const outcome = GetOutcomeByIdFromDesiresArray(loadedDesiresAndAll, description.outcomeId)
          const currentRoutine:RoutineAndTasks[] = GetCurrentListById(description.itemId, outcome[0].routines) as RoutineAndTasks[]
          const result = ReturnCompletedTasksForm(currentRoutine[0])
          setOutput(result)
        }
      }

      if (type === 'timeblock') { 

        const outcome = GetOutcomeByIdFromDesiresArray(loadedDesiresAndAll, description.outcomeId)[0]

        const result = (<><div><OutcomeListsDisplay outcome={outcome} /></div></>)
        setOutput(result)
      }

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


    }
  }, [description])

  return (
    <>

      {output}






    </>
  )
}

export default DisplayCurrentEvent

const NoItemListFound = (text: string) => {
  return (<><div> No Item {text} Found</div></>)
}


export const ReturnCompletedTodosForm = (list: ListAndToDos | undefined) => {
  if (list === undefined) return NoItemListFound('List')
  return (<><div> < CompletedTodosForm list={list} /></div></>)
}

export const ReturnCompletedTasksForm = (routine: RoutineAndTasks | undefined) => {
  if (routine === undefined) return NoItemListFound('Routine')
  return (<><div> <CompletedTasksForm routine={routine} /></div></>)
}