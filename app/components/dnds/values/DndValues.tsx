import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import DndSortableValue from './DndSortableValue';
import Modal from '~/components/modals/Modal';
import HeadingH1 from '~/components/titles/HeadingH1';
import SuccessMessage from '~/components/modals/SuccessMessage';

import type { Values } from '@prisma/client'
import type { ValuesWithStringDates } from '~/types/valueTypes'

interface DndValuesProps {
  setOrderBool?: (bool: boolean) => void
}

const DndValues: React.FC<DndValuesProps> = ({ setOrderBool }) => {

  const valuesData = useLoaderData<ValuesWithStringDates[]>();
  const fetcher = useFetcher();
  const [values, setValues] = useState<Values[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);

  useEffect(() => {
    if (valuesData) { setValues(transformValueDates(valuesData)) }
  }, [valuesData])

  const handleEditSortOrder = useCallback(async () => {
    const valuesString = JSON.stringify(values);
    try {
      fetcher.submit({
        valuesString
      }, {
        method: 'POST',
      })
      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 500); // Clear the message after 3 seconds
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [values, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])

  function transformValueDates(values: any) {
    return values.map((value: any) => ({
      ...value,
      createdAt: new Date(value.createdAt!),
      updatedAt: new Date(value.updatedAt!),
    }));
  }

  const resetValuesSortOrder = (values: Values[]) => {
    const reOrdered = values?.map((value, index) => {
      return {
        ...value,
        sortOrder: index
      }
    })
    setSaveNewSortOrder(true)
    return reOrdered
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setValues((prevValues: Values[]) => {
        const oldIndex = prevValues.findIndex(value => value.id === active.id);
        const newIndex = prevValues.findIndex(value => value.id === over?.id);
        const newValues = arrayMove(prevValues, oldIndex, newIndex);
        return resetValuesSortOrder(newValues);
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
      <HeadingH1 text={'Your Values'} />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={values?.map(value => value.id)}
          strategy={verticalListSortingStrategy}
        >
          {values?.map((value) => (
            <DndSortableValue
              key={value.id}
              id={value.id}
              value={value}
            />
          ))}
        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndValues