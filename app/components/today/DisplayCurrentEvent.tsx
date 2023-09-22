import { useEffect, useState } from 'react'

import TodosCompletedForm from '../forms/TodosCompletedForm'
import RoutineTodosCompletedForm from '../forms/RoutineTodosCompletedForm'

import type { ListAndToDos } from '~/types/listTypes'
import type { RoutineAndToDos } from '~/types/routineTypes'
import type { Project, ScheduledList } from '@prisma/client'

type Props = {
  event: ScheduledList
  loadedLists: ListAndToDos[]
  loadedRoutines: RoutineAndToDos[]
  loadedProjects: Project[]
}

function DisplayCurrentEvent({ event, loadedProjects, loadedRoutines, loadedLists }: Props) {

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
    if (typeOfEvent === 'todos') {
      const toDosList = loadedLists.find((loadedList) => loadedList.id === event.listId)
      if (toDosList === undefined) return
      const result = (<><div> < TodosCompletedForm list={toDosList} /></div></>)
      setOutput(result)
      return 
    }

    if (typeOfEvent === 'routineToDos') {
      const routine = loadedRoutines.find((loadedRoutine) => loadedRoutine.id === event.listId)
      if (routine === undefined) return
      const result = (<><div> < RoutineTodosCompletedForm routine={routine} /></div></>)
      setOutput(result)
      return 
    }

    if (typeOfEvent === 'projectLists') {
      console.log('projectLists')
      const result = (<><div>Projects</div></>)
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