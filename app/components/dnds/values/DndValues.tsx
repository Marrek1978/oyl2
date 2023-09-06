import { useCallback, useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import Modal from '~/components/modals/Modal';
import SuccessMessage from '~/components/modals/SuccessMessage';
import SubHeading16px from '~/components/titles/SubHeading16px';
import DndSortableGeneric from '~/components/dnds/DndSortableGeneric';

import type { Value } from '@prisma/client'
import type { ValuesWithStringDates } from '~/types/valueTypes'

const DndValues = () => {

  const fetcher = useFetcher();
  const valuesData = useLoaderData<ValuesWithStringDates[]>();

  const [values, setValues] = useState<Value[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveNewSortOrder, setSaveNewSortOrder] = useState<boolean>(false);


  useEffect(() => {
    if (valuesData) { setValues(transformValueDates(valuesData)) }
  }, [valuesData])


  useEffect(() => {
    if (fetcher.state === 'loading') {
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 500); // Clear the message after 3 seconds
    }
  }, [fetcher])


  const handleEditSortOrder = useCallback(async () => {
    const valuesString = JSON.stringify(values);
    try {
      fetcher.submit({
        valuesString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    setSaveNewSortOrder(false);
  }, [values, fetcher])


  useEffect(() => {
    if (saveNewSortOrder) {
      handleEditSortOrder()
    }
  }, [saveNewSortOrder, handleEditSortOrder])


  const resetValuesSortOrder = (values: Value[]) => {
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

      <div className='flex justify-between items-baseline'>
        <div className='text-success mb-2'>
          <SubHeading16px text='Your Values' />
        </div>
      </div>

      <div className=''>

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
              <DndSortableGeneric
                key={value.id}
                id={value.id}
                description={value.valueDescription}
                title={value.valueTitle}
              >
              </DndSortableGeneric>
            ))}

          </SortableContext>
        </DndContext >
      </div>
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
