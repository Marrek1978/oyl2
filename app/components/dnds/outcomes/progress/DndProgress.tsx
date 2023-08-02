import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
// import DndSortableDesire from '~/components/dnds/desires/DndSortableDesire';


import type { DesireWithStringDates, DesireWithValues } from '~/types/desireTypes'
import HeadingH1 from '~/components/titles/HeadingH1';
import DndSortableGeneric from '~/components/genericComponents/dnd/DndSortableGeneric';
import SubHeading12px from '~/components/titles/SubHeading12px';

interface DndProgressProps {
  progressList?: string[]
}

function DndProgress({progressList}: DndProgressProps)  {

  const fetcher = useFetcher();
  const loaderData = useRouteLoaderData('routes/dash.desires');

  const [desires, setDesires] = useState<DesireWithValues[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  useEffect(() => {
    if (loaderData?.desires) { setDesires(transformDesireDates(loaderData?.desires)) }
  }, [loaderData])

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

  function transformDesireDates(desires: DesireWithStringDates[]) {
    return desires.map((desire: any) => ({
      ...desire,
      createdAt: new Date(desire.createdAt!),
      updatedAt: new Date(desire.updatedAt!),
    }));
  }



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


    console.log('progressList', progressList)
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
      <HeadingH1 text={'Your evidences'} />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={progressList?.map((desire,index) => index)}
          strategy={verticalListSortingStrategy}
        >

          {progressList?.map((progress, index) => {

            // const desireValues = p.desireValues
            // desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)

            return (
              <DndSortableGeneric
                key={index}
                id={`${index}`}
                title={progress}
                description={progress}
                linkTitle='nope'
              >

                {/* <div className="flex flex-wrap gap-2 items-center w-full mt-1">
                  {desireValues.map((value) => {
                    const title = value.value.valueTitle
                    let id = uuidv4();
                    return (
                      <div key={id}
                        className={`
                        font-medium 
                        text-slate-600
                      `} >
                        <SubHeading12px
                          text={`${title}, `}
                        />
                      </div>
                    )
                  })
                  }
                </div> */}
              </DndSortableGeneric>
            )
          })}


        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndProgress