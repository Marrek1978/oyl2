// import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react';
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
// import DndSortableDesire from '~/components/dnds/desires/DndSortableDesire';


import type { DesireWithValues } from '~/types/desireTypes'
// import HeadingH1 from '~/components/titles/HeadingH1';
import type { DesireOutcomeProgress } from '@prisma/client';
import type { NewlyCreatedProgress } from '~/types/progressTypes';
import ProgressEvidenceItem from './ProgressEvidenceItem';
import HeadingH2 from '~/components/titles/HeadingH2';

interface DndProgressProps {
  progressList?: DesireOutcomeProgress[] | NewlyCreatedProgress[]
}

function DndProgress({ progressList }: DndProgressProps) {

  console.log(' in DndProgress, progressList: ', progressList)
  const fetcher = useFetcher();
  // const loaderData = useRouteLoaderData('routes/dash.desires');

  const [desires, setDesires] = useState<DesireWithValues[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);
  const [progressListArray, setProgressListArray] = useState<DesireOutcomeProgress[] | NewlyCreatedProgress[]>([]);

  // useEffect(() => {
  //   if (loaderData?.progressList) { setDesires(transformProgressDates(loaderData?.progressList)) }
  // }, [loaderData])


  useEffect(() => {
    if (progressList) { setProgressListArray(progressList) }
  }, [progressList])

  const handleEditSortOrder = useCallback(async () => {
    const desiresString = JSON.stringify(desires);
    try {
      fetcher.submit({
        desiresString
      }, {
        method: 'POST',
      })
      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 500); // Clear the message after 3 seconds
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [desires, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])

  // function transformDesireDates(desires: DesireWithStringDates[]) {
  //   return desires.map((desire: any) => ({
  //     ...desire,
  //     createdAt: new Date(desire.createdAt!),
  //     updatedAt: new Date(desire.updatedAt!),
  //   }));
  // }



  const resetDesiresSortOrder = (desires: DesireWithValues[]) => {
    const reOrdered = desires?.map((desire, index) => {
      return {
        ...desire,
        sortOrder: index
      }
    })
    setSaveNewSortOrder(true)
    return reOrdered
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDesires((prevDesires: DesireWithValues[]) => {
        const oldIndex = prevDesires.findIndex(desire => desire.id === active.id);
        const newIndex = prevDesires.findIndex(desire => desire.id === over?.id);
        const newDesires = arrayMove(prevDesires, oldIndex, newIndex);
        return resetDesiresSortOrder(newDesires);
      })
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }))


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
      
      <div className='mt-4'>
        <HeadingH2 text={'Evidence of Progress towards Outcome'} />
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >

        <SortableContext
          items={progressListArray.map((progress) => progress.id)}
          strategy={verticalListSortingStrategy}
        >
          {progressListArray?.map((progress) => {
            // const desireValues = p.desireValues
            // desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)

            return (
              <ProgressEvidenceItem
                key={progress.id}
                id={progress.id}
                progress={progress}
                editTodo={() => { }}
                removeTodo={() => { }}
              />
            )
          })}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndProgress