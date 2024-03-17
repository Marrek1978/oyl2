import { Form } from '@remix-run/react';
import React, { useEffect, useState } from 'react'

import Modal from './Modal';
import FormButtons from '../../buttons/FormButtons';
import BasicFormAreaBG from '../../forms/util/BasicFormAreaBG';
import { DesireOutcomeGuideline } from '../../utilities/Guidelines';
import InputLabelWithGuideLineLink from '../../forms/inputs/InputLabelWithGuideLineLink';

import type { CreationTask } from '~/types/routineTypes'


interface EditTaskProps {
  task: CreationTask | null;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTask: (index: number, todo: CreationTask) => void;
  index: number | null;
}

const EditTaskModal: React.FC<EditTaskProps> = ({ task, setIsEditTaskModalOpen, updateTask, index }) => {

  const [body, setBody] = useState<string>(task?.body || '');
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  useEffect(() => {
    setIsSaveable(body !== task?.body)
  }, [body, task]);


  const handleSave = () => {
    if (task === null || index === null) {
      return;
    }
    const updatedTask: CreationTask = {
      ...task,
      body,
    };

    updateTask(index, updatedTask);
    setIsEditTaskModalOpen(false);
  }


  return (
    <>
      <input type="checkbox"
        id={`edit-task-modal-${task?.id}`}
        className="modal-toggle" />

      <Modal >
        <div className="modalFormWidth__sm">
          <BasicFormAreaBG h2Text='Edit your Routine Item'  >
            <Form method='post' className='p-8'>
              <div className="form-control gap-6  ">
                <div >
                  <InputLabelWithGuideLineLink
                    inputTitle='Task'
                    guideLineTitle='Task'
                    guideline={DesireOutcomeGuideline} />
                  <input type="text"
                    placeholder="Enter a Task Item"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className=" input-field-text-title "
                  />
                </div>

                <FormButtons
                  saveBtnText='Accept Edits'
                  saveBtnOnClickFunction={handleSave}
                  isSaveBtnDisabled={!isSaveable}
                  closeBtnText='Cancel Edits'
                  closeBtnOnClickFunction={() => setIsEditTaskModalOpen(false)}
                />
              </div>
            </Form>
          </BasicFormAreaBG >
        </div >
      </Modal >
    </>
  )
}

export default EditTaskModal