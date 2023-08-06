import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import HeadingH1 from '~/components/titles/HeadingH1';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SubHeading14px from '~/components/titles/SubHeading14px';
import DndSortableGeneric from '~/components/genericComponents/dnd/DndSortableGeneric';

import type { DesireOutcome } from '@prisma/client'
import type { OutcomeWithProgressList } from '~/types/outcomeTypes';



interface DndOutcomesProps {
  setOrderBool?: (bool: boolean) => void
  desireName?: string
}

const DndOutcomes: React.FC<DndOutcomesProps> = ({ setOrderBool, desireName }) => {

  const fetcher = useFetcher();
  const outcomesData = useLoaderData<OutcomeWithProgressList[]>();

  const [successMessage, setSuccessMessage] = useState('');
  const [outcomes, setOutcomes] = useState<OutcomeWithProgressList[]>([]);
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  console.log('in dndoutcomes and outcomesData is ', outcomesData)

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
      <HeadingH1 text={'Desired Outcomes'} />
      <div className='text-base-content/70'>
        <SubHeading14px text={`For desire: ${desireName}`} />
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

          {outcomes?.map((outcome) => (

            <DndSortableGeneric
              key={outcome.id}
              id={outcome.id}
              description={outcome.description || ' '}
              title={outcome.title}
            >

              {outcome.desireOutcomeProgress.map((progress, index) => (
                <div key={index} >
                  {progress.title}
                </div>
              ))}

            </DndSortableGeneric>
          ))}

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