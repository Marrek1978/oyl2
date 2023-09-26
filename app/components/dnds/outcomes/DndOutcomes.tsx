import { useCallback, useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';

import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import PageTitle from '~/components/titles/PageTitle';
import DndOutcomesSortable from './DndOutcomesSortable';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SuccessMessage from '~/components/modals/SuccessMessage';
import { useGetDesireWithValuesAndOutcomes } from '~/routes/dash.desires';


import type { DragEndEvent } from "@dnd-kit/core";
import type { Outcome } from '@prisma/client';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';




const DndOutcomes: React.FC = () => {

  const fetcher = useFetcher();
  const [desireName, setDesireName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  const desire: DesireWithValuesAndOutcomes | undefined = useGetDesireWithValuesAndOutcomes();
  const loadedOutcomes = desire?.outcomes


  useEffect(() => {
    if (!desire) return
    setDesireName(desire.title)
  }, [desire])


  useEffect(() => {

    if (!loadedOutcomes) return
    const sortedOutcomes = loadedOutcomes.sort((a, b) => a.sortOrder - b.sortOrder)
    const isSequentialOrder = areOutcomesInSequentialOrder(sortedOutcomes)

    setOutcomes(isSequentialOrder
      ? sortedOutcomes
      : resetOutcomesSortOrder(sortedOutcomes)
    )
  }, [loadedOutcomes])


  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 500);
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    const outcomesString = JSON.stringify(outcomes);
    try {
      fetcher.submit({
        outcomesString
      }, {
        method: 'POST',
        action: '/dash/desires/$desireId_/outcomes',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [outcomes, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])


  const resetOutcomesSortOrder = (outcomes: Outcome[]) => {
    const reOrdered = outcomes?.map((outcome, index) => {
      return {
        ...outcome,
        sortOrder: index
      }
    })
    setSaveNewSortOrder(true)
    return reOrdered
  }


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOutcomes((prevOutcomes: Outcome[]) => {
        const oldIndex = prevOutcomes.findIndex(outcome => outcome.id === active.id);
        const newIndex = prevOutcomes.findIndex(outcome => outcome.id === over?.id);
        const newOutcomes = arrayMove(prevOutcomes, oldIndex, newIndex);
        return resetOutcomesSortOrder(newOutcomes);
      })
    }
  }


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )


  return (
    <>
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          <SuccessMessage
            text={successMessage}
          />
        </Modal>)
      }

      <PageTitle text='Desired Outcomes' />

      <div className="flex flex-wrap gap-x-2 mt-0  text-base-content/50">
        <SubHeading14px
          text={`For the Desire: `}
        />
        <div className='font-semibold text-secondary/60 whitespace-normal'>
          <SubHeading14px text={desireName || ''} />
        </ div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={outcomes?.map(outcome => outcome.id)}
          strategy={verticalListSortingStrategy}
        >


          <div className='mt-4'>
            {outcomes?.map((outcome) => (
              <DndOutcomesSortable
                key={outcome.id}
                id={outcome.id}
                outcome={outcome}
              >
              </DndOutcomesSortable>
            ))}
          </div>

        </SortableContext>
      </DndContext >
    </>
  )
}


export default DndOutcomes


export function areOutcomesInSequentialOrder(outcomes: Outcome[]): boolean {
  outcomes.sort((a, b) => a.sortOrder - b.sortOrder)
  const isNOTSequentialOrder = outcomes.some((outcome, index) => {
    return outcome.sortOrder !== index
  })
  return !isNOTSequentialOrder
}
