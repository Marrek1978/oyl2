import React, { useEffect, useState } from 'react'
import { Form } from '@remix-run/react';

import Modal from '~/components/displays/modals/Modal';
import DatePicker from '~/components/forms/inputs/DatePicker'
import FormButtons from '~/components/buttons/FormButtons';
import BasicFormAreaBG from '~/components/forms/util/BasicFormAreaBG';
import { DesireOutcomeGuideline } from '~/components/utilities/Guidelines';
import InputLabelWithGuideLineLink from '~/components/forms/inputs/InputLabelWithGuideLineLink';
import ToggleWithLabelAndGuideLineLink from '~/components/forms/inputs/ToggleWithLabelAndGuideLineLink';

import type { CreationTodo } from '~/types/listTypes';

interface EditToDoProps {
  todo: CreationTodo | null;
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTodo: (index: number, updatedTodo: CreationTodo) => void;
  index: number | null;
}

const EditListToDoModal: React.FC<EditToDoProps> = ({ todo, setIsEditToDoModalOpen, updateTodo, index }) => {

  const [body, setBody] = useState<string>(todo?.body || '');
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [isUrgent, setIsUrgent] = useState<boolean>(todo?.isUrgent || false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isImportant, setIsImportant] = useState<boolean>(todo?.isImportant || false);


  useEffect(() => {
    if (todo?.dueDate) {
      const parsedDate = new Date(todo.dueDate);
      setSelectedDate(parsedDate);
    } else {
      setSelectedDate(null)
    }
  }, [todo])


  useEffect(() => {
    const dueDate = todo?.dueDate ? new Date(todo.dueDate) : null

    if (body !== todo?.body
      || isUrgent !== todo?.isUrgent
      || isImportant !== todo?.isImportant
      || selectedDate?.getTime() !== dueDate?.getTime()) {
      setIsSaveable(true)
    } else {
      setIsSaveable(false)
    }
  }, [body, isUrgent, isImportant, selectedDate, todo])


  const handleSave = () => {
    console.log('saving edites')
    if (todo === null || index === null) {
      console.error("Todo or index is null.");
      return;
    }

    const updatedTodo: CreationTodo = {
      ...todo,
      body,
      isUrgent,
      isImportant,
      dueDate: selectedDate,
    };
    updateTodo(index, updatedTodo);
    setIsEditToDoModalOpen(false);
  }

  const handleIsUrgent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUrgent(e.target.checked)
    setIsImportant(false)
  }

  const handleIsImportant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImportant(e.target.checked)
    setIsUrgent(false)

  }

  return (
    <>
      <input type="checkbox"
        id={`edit-todo-modal-${todo?.id}`}
        className="modal-toggle" />

      <Modal >
        <div className="modalFormWidth__sm">
          <BasicFormAreaBG h2Text='Edit your To-Do Item' >
            <Form method='post' className='p-8'>
              <div className="form-control gap-y-6   ">
                <div >
                  <InputLabelWithGuideLineLink
                    inputTitle='To Do Item'
                    guideLineTitle='To Do Item'
                    guideline={DesireOutcomeGuideline} />
                  <input type="text"
                    placeholder="Enter a To Do Item"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className=" input-field-text-title "
                  />
                </div>

                <div className='w-full  flex flex-col items-end gap-y-4'>
                  <div className="checkbox-label-flex min-w-[230px] ">
                    <ToggleWithLabelAndGuideLineLink
                      text='Urgent'
                      guideline={DesireOutcomeGuideline}
                      guidelineTitle='Milestone Description'
                      checkedState={isUrgent}
                      handleCheckedState={handleIsUrgent}
                      toggleColorDaisyUI='accent'
                      isSecondaryInput={true}
                    />
                  </div>

                  <div className={`checkbox-label-flex min-w-[230px]`}>
                    <ToggleWithLabelAndGuideLineLink
                      text='Important'
                      guideline={DesireOutcomeGuideline}
                      guidelineTitle='Milestone Description'
                      checkedState={isImportant}
                      handleCheckedState={handleIsImportant}
                      toggleColorDaisyUI='success'
                      isSecondaryInput={true}
                    />
                  </div>

                  <div className={` min-w-[230px] text-base-content/70`}>
                    <DatePicker
                      setSelectedDate={setSelectedDate}
                      selectedDate={selectedDate}
                      isSecondaryInput={true}
                    />
                  </div>
                </div>

                <FormButtons
                  saveBtnText='Accept Edits'
                  saveBtnOnClickFunction={handleSave}
                  isSaveBtnDisabled={!isSaveable}
                  closeBtnText='Cancel Edits'
                  closeBtnOnClickFunction={() => setIsEditToDoModalOpen(false)}
                />
              </div>
            </Form>
          </BasicFormAreaBG >
        </div>
      </Modal >
    </>
  )
}

export default EditListToDoModal