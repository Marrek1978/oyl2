import { useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react'
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import DndSortableDesire from './DndSortableDesire';
import SuccessMessage from '~/components/modals/SuccessMessage';
import { useGetAllDesiresWithValuesAndOutcomes } from "~/routes/dash.desires";

import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes'


const DndDesires = () => {

  const fetcher = useFetcher();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);
  const [desires, setDesires] = useState<DesireWithValuesAndOutcomes[]>([]);

  const loadedDesires: DesireWithValuesAndOutcomes[] | undefined = useGetAllDesiresWithValuesAndOutcomes();

  useEffect(() => {
    if (!loadedDesires) return
    const isSequentialOrder: boolean = areDesiresInSequentialOrder(loadedDesires)

    setDesires(isSequentialOrder
      ? loadedDesires
      : resetDesiresSortOrder(loadedDesires)
    )
  }, [loadedDesires])


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


export function areDesiresInSequentialOrder(desires: DesireWithValuesAndOutcomes[]): boolean {

  desires.sort((a, b) => a.sortOrder - b.sortOrder)
  const isNOTSequentialOrder = desires.some((desire, index) => {
    return desire.sortOrder !== index
  })
  return !isNOTSequentialOrder
}

