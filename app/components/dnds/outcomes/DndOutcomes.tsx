import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import DndOutcomesSortable from './DndOutcomesSortable';
import SuccessMessage from '~/components/modals/SuccessMessage';

import type { DesireOutcome } from '@prisma/client';
import PageTitle from '~/components/titles/PageTitle';
import { useDesireWithValuesAndOutcomes } from '~/routes/dash.desires';
import SubHeading14px from '~/components/titles/SubHeading14px';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes';




const DndOutcomes: React.FC = () => {

  const fetcher = useFetcher();
  const outcomesData = useLoaderData<DesireOutcome[]>();

  const [desireName, setDesireName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [outcomes, setOutcomes] = useState<DesireOutcome[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  const desire: DesireWithValuesAndOutcomes | undefined = useDesireWithValuesAndOutcomes({ route: 'routes/dash.desires' });


  useEffect(() => {
    if (!desire) return
    setDesireName(desire.title)
  }, [desire])


  useEffect(() => {
    if (!outcomesData) return

    const outcomesWithProperDates: DesireOutcome[] = transformOutcomeDates(outcomesData)
    outcomesWithProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
    const notOutcomesWithSequentialSortOrder = outcomesWithProperDates.some((outcome, index) => {
      return outcome.sortOrder !== index
    })
    setOutcomes(notOutcomesWithSequentialSortOrder
      ? resetOutcomesSortOrder(outcomesWithProperDates)
      : outcomesWithProperDates
    )
  }, [outcomesData])


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


  const resetOutcomesSortOrder = (outcomes: DesireOutcome[]) => {
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
      setOutcomes((prevOutcomes: DesireOutcome[]) => {
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

      <PageTitle text='Outcomes' />

      <div className="flex flex-wrap gap-x-2 mt-2  text-base-content/50">
        <SubHeading14px
          text={`For the Desire: `}
        />
        <div className='font-semibold text-secondary/70 whitespace-normal'>
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

function transformOutcomeDates(values: any) {
  return values.map((value: any) => ({
    ...value,
    createdAt: new Date(value.createdAt!),
    updatedAt: new Date(value.updatedAt!),
    dueDate: value.dueDate ? new Date(value.dueDate) : null,
  }));
}