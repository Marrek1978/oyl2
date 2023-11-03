import { useEffect, useState } from 'react'

import DesiresAndOutcomesList from './DesiresAndOutcomesList'
import SelectedOutcomeDraggables from './SelectedOutcomeDraggables'

import type { OutcomeWithAll } from '~/types/outcomeTypes'
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes'


type Props = {
  OutcomesWithAll: DesireWithOutcomesAndAll[]
  handleDragStart: (event: any) => void;
}


function DesiresAndOutcomesWithListsAndRoutinesAsDraggables({ OutcomesWithAll, handleDragStart }: Props) {

  const desires: DesireWithOutcomesAndAll[] = OutcomesWithAll
  const [isMainFocus, setIsMainFocus] = useState<boolean>(false)
  const [selectedDesire, setSelectedDesire] = useState<DesireWithOutcomesAndAll>()
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeWithAll>()


  // initial load 
  useEffect(() => {
    const desireZero = desires.find((desire: DesireWithOutcomesAndAll) => desire.sortOrder === 0)
    desireZero && setSelectedDesire(desireZero)
    const outcomeZero = desireZero?.outcomes.find((outcome: OutcomeWithAll) => outcome.sortOrder === 0)
    outcomeZero && setSelectedOutcome(outcomeZero)
    setIsMainFocus(true)
  }, [desires])


  const handleDesireSelection = (id: string) => {
    const desire = desires.find((desire: DesireWithOutcomesAndAll) => desire.id === id)
    if (desire) {
      if (desire !== selectedDesire) {
        setSelectedDesire(desire)
        desire?.outcomes && setSelectedOutcome(desire.outcomes[0])
        setIsMainFocus(desire.sortOrder === 0 ? true : false)
      }
    }
  }

  const handleOutcomeSelection = (id: string) => {
    const clickedOutcome = selectedDesire?.outcomes.find((outcome: OutcomeWithAll) => {
      return outcome.id === id
    })
    setSelectedOutcome(clickedOutcome)
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

        {selectedOutcome && (
          <>
            <SelectedOutcomeDraggables
              selectedOutcome={selectedOutcome}
              handleDragStart={handleDragStart}
              isMainFocus={isMainFocus}
            />
          </>
        )}

      </div>
    </>
  )
}

export default DesiresAndOutcomesWithListsAndRoutinesAsDraggables