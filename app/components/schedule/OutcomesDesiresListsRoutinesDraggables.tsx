import { useEffect, useState } from 'react'


import type { ListAndToDos } from '~/types/listTypes'
import type { OutcomeWithAll } from '~/types/outcomeTypes'
import type { RoutineAndTasks } from '~/types/routineTypes'
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes'
import DesiresAndOutcomesList from './DesiresAndOutcomesList'
import { set } from 'date-fns'


type Props = {
  OutcomesWithAll: DesireWithOutcomesAndAll[]
  handleDragStart: (event: any) => void;
}


function DesiresAndOutcomesWithListsAndRoutinesAsDraggables({ OutcomesWithAll, handleDragStart }: Props) {

  const desires: DesireWithOutcomesAndAll[] = OutcomesWithAll

  const [isMainFocus, setIsMainFocus] = useState<boolean>(false)
  const [selectedDesire, setSelectedDesire] = useState<DesireWithOutcomesAndAll>()
  const [outcomes, setOutcomes] = useState<OutcomeWithAll[]>()
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeWithAll>()
  console.log("🚀 ~ file: OutcomesDesiresListsRoutinesDraggables.tsx:26 ~ DesiresAndOutcomesWithListsAndRoutinesAsDraggables ~ selectedOutcome:", selectedOutcome)
  // const [selectedList, setSelectedLists] = useState<ListAndToDos[]>()
  // const [selectedRoutines, setSelectedRoutines,] = useState<RoutineAndTasks[]>()


  // initial load 
  useEffect(() => {
      const desireZero = desires.find((desire: DesireWithOutcomesAndAll) => desire.sortOrder === 0)
      desireZero && setSelectedDesire(desireZero)
      const outcomeZero = desireZero?.outcomes.find((outcome: OutcomeWithAll) => outcome.sortOrder === 0)
      outcomeZero && setSelectedOutcome(outcomeZero)
      // desire?.outcomes?.lists && setSelectedLists(desire.outcomes.lists)
      // desire?.outcomes?.routines && setSelectedRoutines(desire.outcomes.routines)
      setIsMainFocus(true)
  }, [desires])





  const handleDesireSelection = (id: string) => {
    // console.log('id is ', id)
    // setSelectedProjectId(id)
    const desire = desires.find((desire: DesireWithOutcomesAndAll) => desire.id === id)
    if (desire) {
      setSelectedDesire(desire)
      desire?.outcomes && setSelectedOutcome(desire.outcomes[0])
      // desire?.outcomes.lists && setSelectedProjectLists(desire.lists)
      // desire?.routines && setSelectedProjectRoutines(desire.routines)
      setIsMainFocus(desire.sortOrder === 0 ? true : false)
    }
  }

  const handleOutcomeSelection = (id: string) => {
    const outcome = selectedDesire?.outcomes.find((outcome: OutcomeWithAll) => outcome.id === id)
    setSelectedOutcome(outcome)
  }



  return (
    <>
      <div className='flex gap-8'>

        <DesiresAndOutcomesList
          desires={desires}
          handleDesireSelection={handleDesireSelection}
          selectedDesire={selectedDesire}
          handleOutcomeSelection={handleOutcomeSelection}
          selectedOutcome={selectedOutcome}
        />

        {/* {selectedDesire && (
          <>
            <SelectedProject
              selectedProject={selectedDesire}
              handleDragStart={handleDragStart}
              selectedProjectLists={selectedList}
              selectedProjectRoutines={selectedRoutines}
              isMainFocus={isMainFocus}
            />
          </>
        )} */}

      </div>
    </>
  )
}

export default DesiresAndOutcomesWithListsAndRoutinesAsDraggables