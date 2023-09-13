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

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>([]);


  useEffect(() => {
    if (!loaderData?.desiresWithValuesOutcomes) return

    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes
    const desiresWithValuesOutcomesProperDates: DesireWithValuesAndOutcomes[] = transformDesireValueOutcomeDates(desiresWithValuesOutcomesStrDates)
    const isSequentialOrder:boolean = isDesireInSequentialOrder(desiresWithValuesOutcomesProperDates)

    setDesires(isSequentialOrder
      ? desiresWithValuesOutcomesProperDates
      : resetDesiresSortOrder(desiresWithValuesOutcomesProperDates)
    )
  }, [loaderData])


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

            const desireOutcomes = desire.desireOutcomes
            desireValues.sort((a, b) => a.value.sortOrder - b.value.sortOrder)

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

export function transformDesireValueOutcomeDates(desiresWithValuesOutcomes: DesireWithValuesAndOutcomesWithStringDates[]): DesireWithValuesAndOutcomes[] {

  const desires = desiresWithValuesOutcomes.map((desire: DesireWithValuesAndOutcomesWithStringDates) => {
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

export function isDesireInSequentialOrder(desiresValuesOutcomesWithProperDates: DesireWithValuesAndOutcomes[]) : boolean {

  desiresValuesOutcomesWithProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
  const isNOTSequentialOrder = desiresValuesOutcomesWithProperDates.some((desire, index) => {
    return desire.sortOrder !== index
  })
  return !isNOTSequentialOrder
}

