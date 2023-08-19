import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';

import type { OutcomeWithProgressList } from '~/types/outcomeTypes';
import SubHeading16px from '~/components/titles/SubHeading16px';
import DndOutcomesSortable from './DndOutcomesSortable';
import { formatDate } from '~/utils/functions';
import HeadingH2 from '~/components/titles/HeadingH2';


interface DndOutcomesProps {
  desireName?: string;
  description?: string;
}

const DndOutcomes: React.FC<DndOutcomesProps> = ({ desireName, description }) => {

  const fetcher = useFetcher();
  const outcomesData = useLoaderData<OutcomeWithProgressList[]>();

  const [successMessage, setSuccessMessage] = useState('');
  const [outcomes, setOutcomes] = useState<OutcomeWithProgressList[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  useEffect(() => {
    if (outcomesData) { setOutcomes(transformOutcomeDates(outcomesData)) }
  }, [outcomesData])


  useEffect(() => {
    if (fetcher.state === 'loading') {

      setSuccessMessage('List was saved');
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
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [outcomes, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])


  const resetOutcomesSortOrder = (outcomes: OutcomeWithProgressList[]) => {
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
      setOutcomes((prevOutcomes: OutcomeWithProgressList[]) => {
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
          {successMessage}
          <SuccessMessage
            text={'Order was updated'}
          />
        </Modal>)
      }
      <div className='text-success mb-2'>
        <SubHeading16px text={`Measurable Outcomes for the Desire: `} />
      </div>
      <div className=' max-w-prose'>
        <HeadingH2 text={desireName || ''} />
      </div>
      
      {description && (
        <div className='mt-2 max-w-prose text-base-content/70'>
          {description}
        </div>
      )}
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

                {outcome.desireOutcomeProgress.map((progress, index) => (
                  <div key={index} className='mt-0 grid grid-cols-[auto_max-content] items-baseline gap-4'>
                    {progress.title}
                    {progress.dueDate && (
                      <div className='text-sm text-base-content/70'>
                        {progress.dueDate ? formatDate(progress.dueDate) : ''}

                      </div>
                    )}
                  </div>
                ))}

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