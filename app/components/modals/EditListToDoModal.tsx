import React, { useEffect, useState } from 'react'
import { Form } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import InputLabel from '../forms/InputLabel';
import DatePicker from '~/components/list/DatePicker'
import BasicFormAreaBG from '../forms/BasicFormAreaBG';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { DesireOutcomeGuideline } from '../utilities/Guidelines';
import InputLabelWithGuideLineLink from '../forms/InputLabelWithGuideLineLink';

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
  const [urgent, setUrgent] = useState<boolean>(todo?.urgent || false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [important, setImportant] = useState<boolean>(todo?.important || false);


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
      || urgent !== todo?.urgent
      || important !== todo?.important
      || selectedDate?.getTime() !== dueDate?.getTime()) {
      setIsSaveable(true)
    } else {
      setIsSaveable(false)
    }
  }, [body, urgent, important, selectedDate, todo])


  const handleSave = () => {
    if (todo === null || index === null) {
      console.error("Todo or index is null.");
      return;
    }


    const updatedTodo: CreationTodo = {
      ...todo,
      body,
      urgent,
      important,
      dueDate: selectedDate,
    };
    updateTodo(index, updatedTodo);
    setIsEditToDoModalOpen(false);
  }

  const handleIsUrgent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrgent(e.target.checked)
    setImportant(false)
  }

  const handleIsImportant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportant(e.target.checked)
    setUrgent(false)

  }

  return (
    <>
      <input type="checkbox"
        id={`edit-todo-modal-${todo?.id}`}
        className="modal-toggle" />

      <div className="modal z-40 ">
        <BasicFormAreaBG
          title='Edit your To-Do Item'
        >
          <Form method='post' className='mx-8'>
            <div className="form-control gap-6 vert-space-between-inputs ">
              <div >
                <InputLabelWithGuideLineLink
                  text='To Do Item'
                  title='To Do Item'
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
                  <InputLabel text='Urgent' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={urgent}
                    onChange={handleIsUrgent}
                  />
                </div>

                <div className=" checkbox-label-flex">
                  <InputLabel text='Important' />
                  <input type="checkbox"
                    className="toggle toggle-secondary"
                    checked={important}
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
                  text='Accept Edits'
                  onClickFunction={handleSave}
                  disableSaveBtn={!isSaveable}
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