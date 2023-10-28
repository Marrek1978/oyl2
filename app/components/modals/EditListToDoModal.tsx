import React, { useEffect, useState } from 'react'
import { Form } from '@remix-run/react';

import SolidBtn from '~/components/buttons/SolidBtn';
import InputLabel from '~/components/forms/InputLabel';
import DatePicker from '~/components/list/DatePicker'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import SolidBtnGreyBlue from '~/components/buttons/SolidBtnGreyBlue';
import { DesireOutcomeGuideline } from '~/components/utilities/Guidelines';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';

import type { CreationTodo } from '~/types/listTypes';

interface EditToDoProps {
  todo: CreationTodo | null;
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTodo: (index: number, updatedTodo: CreationTodo) => void;
  index: number | null;
}

const EditListToDoModal: React.FC<EditToDoProps> = ({ todo, setIsEditToDoModalOpen, updateTodo, index }) => {
console.log("🚀 ~ file: EditListToDoModal.tsx:22 ~ todo:", todo)

  const [body, setBody] = useState<string>(todo?.body || '');
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [isUrgent, setIsUrgent] = useState<boolean>(todo?.isUrgent || false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isImportant, setIsImportant] = useState<boolean>(todo?.isImportant || false);


    useEffect(() => {
    if (todo?.dueDate) {
      const parsedDate = new Date(todo.dueDate);
      setSelectedDate(parsedDate);
    }else{
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

      <div className="modal z-40 ">
        <BasicFormAreaBG
          h2Text='Edit your To-Do Item'
        >
          <Form method='post' className='mx-8'>
            <div className="form-control gap-6 vert-space-between-inputs ">
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


              <div className="flex  items-center gap-12  flex-wrap">
                <div className="checkbox-label-flex">
                  <InputLabel inputTitle='Urgent' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isUrgent}
                    onChange={handleIsUrgent}
                  />
                </div>

                <div className=" checkbox-label-flex">
                  <InputLabel inputTitle='Important' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={isImportant}
                    onChange={handleIsImportant}
                  />
                </div>
              </div>

              <DatePicker
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>


            <div className="flex justify-between my-8 gap-4">
              <div className='flex-1'>
                <SolidBtnGreyBlue
                  text='Cancel Edits'
                  onClickFunction={() => setIsEditToDoModalOpen(false)}
                />
              </div>

              <div className='flex-1'>
                <SolidBtn
                  text='Save Edits'
                  onClickFunction={handleSave}
                  disableBtn={!isSaveable}
                />
              </div>
            </div>

          </Form>
        </BasicFormAreaBG >
      </div >
    </>
  )
}

export default EditListToDoModal