import { ScheduledList } from '@prisma/client'
import React, { useEffect, useState } from 'react'

type Props = {
  event: ScheduledList
}

function DisplayCurrentEvent({ event }: Props) {

  const [typeOfEvent, setTypeOfEvent] = useState<string>('')



  useEffect(() => {
    if (!event) return
    if (event.description === null) return

    const type = Object.keys(event.description)
    console.log('type is ', type)
    setTypeOfEvent(type[0])

  }, [event])



  return (
    <>

      {typeOfEvent === 'todos' && (
        <>

          <div>todos</div>
          <div>display completed checkbox form</div>
        </>
      )}

      {typeOfEvent === 'routineToDos' && (
        <>
          <div>routineToDos</div>
          <div>display completed checkbox form</div>
        </>
      )}


      {typeOfEvent === 'projectLists' && (
        <>
          <div>projectLists</div>
          <div>display list of lists</div>
          <div>display completed checkbox form</div>
        </>
      )}


{(typeOfEvent !== 'projectLists' && typeOfEvent !== 'routineToDos' && typeOfEvent !== 'todos') && (
        <>
          <div>not a project, routine, or list</div>
        </>
      )}


    </>
  )
}

export default DisplayCurrentEvent