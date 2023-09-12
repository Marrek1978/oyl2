import { v4 as uuidv4 } from 'uuid';
import type { DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SubHeading12px from '~/components/titles/SubHeading12px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import DndSortableGeneric from '~/components/dnds/DndSortableGeneric';

import type { DesireWithStringDates, DesireWithValues } from '~/types/desireTypes'


const DndDesires = () => {

  const fetcher = useFetcher();
  const loaderData = useRouteLoaderData('routes/dash.desires');

  const [desires, setDesires] = useState<DesireWithValues[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  useEffect(() => {
     if (!loaderData?.desires) return

    const desiresWithProperDates: DesireWithValues[] = transformDesireDates(loaderData?.desires)
    desiresWithProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
    const notDesiresWithSequentialSortOrder = desiresWithProperDates.some((desire, index) => {
      return desire.sortOrder !== index
    })
    setDesires(notDesiresWithSequentialSortOrder
      ? resetDesiresSortOrder(desiresWithProperDates)
      : desiresWithProperDates
    )

  }, [loaderData])


  useEffect(() => {
    console.log(desires)
  }, [desires])


  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 500);
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    const desiresString = JSON.stringify(desires);
    try {
      fetcher.submit({
        desiresString
      }, {
        method: 'POST',
        action: '/dash/desires'
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [desires, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])


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
          <SuccessMessage
            text={successMessage}
          />
        </Modal>
      )}
      <div className='text-success mb-2'>
        <SubHeading16px text='Your Desires' />
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={desires?.map(desire => desire.id)}
          strategy={verticalListSortingStrategy}
        >

          {desires?.sort((a, b) => a.sortOrder - b.sortOrder).map((desire) => {
            const desireValues = desire.desireValues
            desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)

            return (
              <DndSortableGeneric
                key={desire.id}
                id={desire.id}
                title={desire.title}
                description={desire.description}
                linkTitle='Go to desire'
              >

                <div className="flex flex-wrap gap-2 items-center mt-1 font-bold ">
                  <div className='text-base-content/80'>
                    <SubHeading12px text={'Serves Values:'} />
                  </div>
                  {desireValues.map((value) => {
                    const title = value.value.valueTitle
                    let id = uuidv4();
                    return (
                      <div key={id}
                        className={`
                        font-bold
                        text-secondary/70
                      `} >
                        <SubHeading12px
                          text={`${title}, `}
                        />
                      </div>
                    )
                  })
                  }
                </div>
              </DndSortableGeneric>
            )
          })}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndDesires

function transformDesireDates(desires: DesireWithStringDates[]) {
  return desires.map((desire: any) => ({
    ...desire,
    createdAt: new Date(desire.createdAt!),
    updatedAt: new Date(desire.updatedAt!),
  }));
}
