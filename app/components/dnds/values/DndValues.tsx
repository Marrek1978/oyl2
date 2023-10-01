import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import DndSortableValue from './DndSortableValue';
import SuccessMessage from '~/components/modals/SuccessMessage';

import type { Value } from '@prisma/client'
import type { ValueWithStringDates } from '~/types/valueTypes'
import PageTitle from '~/components/titles/PageTitle';

const DndValues = () => {

  const fetcher = useFetcher();
  const valuesData = useLoaderData<ValueWithStringDates[]>();

  const [values, setValues] = useState<Value[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);



  const handleEditSortOrder = useCallback(async () => {
    console.log('saving to db')
    const valuesString = JSON.stringify(values);
    try {
      fetcher.submit({
        valuesString
      }, {
        method: 'POST',
        action: '/dash/values',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [values, fetcher])


  const resetValuesSortOrder = (values: Value[]) => {
    console.log('resetting sort order')
    const reOrdered = values?.map((value, index) => {
      return {
        ...value,
        sortOrder: index
      }
    })
    setSaveNewSortOrder(true)
    return reOrdered
  }


  //intial load
  useEffect(() => {
    console.log('itnitial loading')
    if (!valuesData) return
    const valuesWithProperDates: Value[] = transformValueDates(valuesData)
    valuesWithProperDates.sort((a, b) => a.sortOrder - b.sortOrder)
    const notValuesWithSequentialSortOrder = valuesWithProperDates.some((value, index) => {
      return value.sortOrder !== index
    })

    setValues(notValuesWithSequentialSortOrder
      ? resetValuesSortOrder(valuesWithProperDates)
      : valuesWithProperDates
    )

  }, [valuesData])


  //success message
  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 500); // Clear the message after 3 seconds
    }
  }, [fetcher])


  useEffect(() => {
    console.log('if saveNewSortOrder -> save: ', saveNewSortOrder)
    if (saveNewSortOrder) handleEditSortOrder()
  }, [saveNewSortOrder, handleEditSortOrder])


  function handleDragEnd(event: DragEndEvent) {
    console.log('dropped')
    const { active, over } = event;
    if (active.id !== over?.id) {
      setValues((prevValues: Value[]) => {
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
          <SuccessMessage
            text={successMessage}
          />
        </Modal>)
      }

      <PageTitle text='Values' />
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
              description={value.valueDescription}
              title={value.valueTitle}
            />
          ))}

        </SortableContext>
      </DndContext >
    </>
  )
}

export default DndValues


function transformValueDates(values: any) {
  return values.map((value: any) => ({
    ...value,
    createdAt: new Date(value.createdAt!),
    updatedAt: new Date(value.updatedAt!),
  }));
}
