import React from 'react';
import { v4 as uuid } from 'uuid';
import SubHeading12px from '../titles/SubHeading12px';

import type { OutcomeWithAll } from '~/types/outcomeTypes';
import type { DesireWithOutcomesAndAll } from '~/types/desireTypes';


type Props = {
  desires: DesireWithOutcomesAndAll[];
  handleDesireSelection: (id: string) => void;
  selectedDesire: DesireWithOutcomesAndAll | undefined
  handleOutcomeSelection: (id: string) => void;
  selectedOutcome: OutcomeWithAll | undefined
}

function DesiresAndOutcomesList({ desires, handleDesireSelection, handleOutcomeSelection, selectedDesire, selectedOutcome }: Props) {

  const DesireZero = ({ desire }: { desire: DesireWithOutcomesAndAll; }) => {
    return (
      <div className='border-2 border-success'>
        <ListedDesire desire={desire}  >
          <div className='p-0 block hover:bg-base-100'>
            <div className='text-success font-bold'>
              <SubHeading12px text={'Primary Desire'} />
            </div>
            {desire.title}
          </div>
        </ListedDesire>
      </div>
    );
  };

  const Desire = ({ desire, }: { desire: DesireWithOutcomesAndAll; }) => {
    return (
      <ListedDesire desire={desire}   >
        {desire.title}
      </ListedDesire>
    )
  }

  const ListedDesire = ({ children, desire, }: { children: React.ReactNode; desire: DesireWithOutcomesAndAll; }) => {

    let outcomes: OutcomeWithAll[] = []
    const isSelectedDesire = desire?.id === selectedDesire?.id
    if (desire?.outcomes) {
      outcomes = desire?.outcomes
    }

    return (
      <div className={`
      scheduler-desiresList 
      ${isSelectedDesire && 'bg-base-100'} 
      `}
        onClick={() => handleDesireSelection(desire.id)}
      >
        {children}
        {isSelectedDesire && outcomes.length > 0 && <OutcomesList outcomes={outcomes} />}
      </div>
    )
  }


  const OutcomesList = ({ outcomes }: { outcomes: OutcomeWithAll[] }) => {
    return (
      <>
        <div className='w-full text-right'>
          {outcomes.map((outcome: OutcomeWithAll) => {
            const randomeId = uuid()
            const isSelectedOutcome = outcome?.id === selectedOutcome?.id
            return (
              <div key={randomeId}
                className={`scheduler-outcomesList ${isSelectedOutcome && 'bg-info/40'} `}
                onClick={() => handleOutcomeSelection(outcome.id)}
              >{outcome.title}
              </div>
            )
          })}
        </div>
      </>
    )
  }


  return (
    <>
      <div className="menu w-56 p-0 [&_li>*]:rounded-none">
        {desires?.map((desire, index) =>
          desire.sortOrder === 0 ? (
            <DesireZero key={desire.id} desire={desire} />
          ) : (
            <Desire key={desire.id} desire={desire} />
          )
        )}

      </div>
    </>
  )
}

export default DesiresAndOutcomesList


