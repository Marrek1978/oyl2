import type { DragEndEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useRouteLoaderData } from '@remix-run/react';
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import DndSortableDesire from './DndSortableDesire';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SubHeading16px from '~/components/titles/SubHeading16px';

import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes'


const DndDesires = () => {

  const fetcher = useFetcher();
  const loaderData = useRouteLoaderData('routes/dash.desires');

  console.log('loader data is ', loaderData)
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  useEffect(() => {

    if (!loaderData?.desiresWithValuesOutcomes) return

    // const desiresWithProperDates: DesireWithValues[] = transformDesireDates(loaderData?.desiresWithValues)

    // console.log('desiresWithProperDates data ', desiresWithProperDates)
    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes
    console.log('desiresWithValuesOutcomesStrDates data ', desiresWithValuesOutcomesStrDates)

    const desiresWithValuesOutcomesProperDates: DesireWithValuesAndOutcomes[] = transformDesireValueOutcomeDates(desiresWithValuesOutcomesStrDates)

    // desiresWithProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
    // const notDesiresWithSequentialSortOrder = desiresWithProperDates.some((desire, index) => {
    //   return desire.sortOrder !== index
    // })

    desiresWithValuesOutcomesProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
    const notDesiresWithSequentialSortOrder = desiresWithValuesOutcomesProperDates.some((desire, index) => {
      return desire.sortOrder !== index
    })

    // setDesires(notDesiresWithSequentialSortOrder
    //   ? resetDesiresSortOrder(desiresWithProperDates)
    //   : desiresWithProperDates
    // )

    setDesires(notDesiresWithSequentialSortOrder
      ? resetDesiresSortOrder(desiresWithValuesOutcomesProperDates)
      : desiresWithValuesOutcomesProperDates
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


  const resetDesiresSortOrder = (desires: DesireWithValuesAndOutcomes[]) => {
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
      setDesires((prevDesires: DesireWithValuesAndOutcomes[]) => {
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
            // console.log('desireValues is ', desireValues)

            const desireOutcomes = desire.desireOutcomes
            desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)
            console.log('desireOutcomes is ', desireOutcomes)

            return (
              <DndSortableDesire
                key={desire.id}
                id={desire.id}
                title={desire.title}
                linkTitle='Go to desire'
                desireValues={desireValues}
                desireOutcomes={desireOutcomes}
              />
            )
          })}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndDesires

// function transformDesireDates(desires: DesireWithStringDates[]) {
//   return desires.map((desire: any) => ({
//     ...desire,
//     createdAt: new Date(desire.createdAt!),
//     updatedAt: new Date(desire.updatedAt!),
//   }));
// }

function transformDesireValueOutcomeDates(desiresWithValuesOutcomes: DesireWithValuesAndOutcomesWithStringDates[]): DesireWithValuesAndOutcomes[] {

  const desires = desiresWithValuesOutcomes.map((desire: DesireWithValuesAndOutcomesWithStringDates) => {


    console.log('desire is ', desire.desireOutcomes)
    const outcomes = desire.desireOutcomes
    const values = desire.desireValues
    let outcomesWithProperDates = []
    let valuesWithProperDates = []

    if (outcomes.length > 0) {
      outcomesWithProperDates = outcomes.map((outcome: any) => ({
        ...outcome,
        createdAt: new Date(outcome.createdAt!),
        updatedAt: new Date(outcome.updatedAt!),
      }))
    }

    if (values.length > 0) {
      valuesWithProperDates = values.map((value: any) => ({
        ...value,
        createdAt: new Date(value.createdAt!),
        updatedAt: new Date(value.updatedAt!),
      }))
    }

    return ({

      ...desire,
      createdAt: new Date(desire.createdAt!),
      updatedAt: new Date(desire.updatedAt!),
      desireOutcomes: outcomesWithProperDates,
      desireValues: valuesWithProperDates
    })
  })

  return desires

}