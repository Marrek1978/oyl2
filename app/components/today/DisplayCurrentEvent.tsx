import { useEffect, useState } from 'react'

import TodosCompletedForm from '../forms/CompletedTodosForm'
import RoutineTodosCompletedForm from '../forms/CompletedTasksForm'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { ScheduledItem } from '@prisma/client'
import type { OutcomeWithLists } from '~/types/outcomeTypes'

type Props = {
  event: ScheduledItem
  loadedLists: ListAndToDos[]
  loadedRoutines: RoutineAndTasks[]
  loadedOutcome: OutcomeWithLists[]
}

function DisplayCurrentEvent({ event, loadedRoutines, loadedLists }: Props) {

  const [typeOfEvent, setTypeOfEvent] = useState<string>('')
  const [output, setOutput] = useState<JSX.Element>((<><div>Nothing is scheduled</div></>))


  useEffect(() => {
    if (!event) return
    if (event.description === null) return

    const type = Object.keys(event.description)[0]
    if (type !== typeOfEvent) {
      setTypeOfEvent(type)
    }

  }, [event, typeOfEvent])



  useEffect(() => {

    console.log('in useEffect and typeOfEvent is: ', typeOfEvent)
    if (typeOfEvent === 'listId') {
      const toDosList = loadedLists.find((loadedList) => loadedList.id === event.itemId)
      if (toDosList === undefined) return
      const result = (<><div> < TodosCompletedForm list={toDosList} /></div></>)
      setOutput(result)
      return 
    }

    if (typeOfEvent === 'routineId') {
      const routine = loadedRoutines.find((loadedRoutine) => loadedRoutine.id === event.itemId)
      if (routine === undefined) return
      const result = (<><div> < RoutineTodosCompletedForm routine={routine} /></div></>)
      setOutput(result)
      return 
    }

    if (typeOfEvent === 'outcomeId') {
      const result = (<><div>Outcome Time Block</div></>)
      setOutput(result)
      return 
      // sort listAndDotos[] by sortOrder
      // display list of lists
      // display completed checkbox form for clicked list
    }

  }, [typeOfEvent, event, loadedLists, loadedRoutines])


  return (
    <>

      {output}






    </>
  )
}

export default DisplayCurrentEvent