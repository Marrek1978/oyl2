import { Form } from '@remix-run/react';
import React, { useEffect, useState } from 'react'

import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from '../forms/BasicFormAreaBG';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { DesireOutcomeGuideline } from '../utilities/Guidelines';
import InputLabelWithGuideLineLink from '../forms/InputLabelWithGuideLineLink';

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
    const updatedTodo: CreationTask = {
      ...task,
      body,
    };

    updateTask(index, updatedTodo);
    setIsEditTaskModalOpen(false);
  }


  return (
    <>
      <input type="checkbox"
        id={`edit-task-modal-${task?.id}`}
        className="modal-toggle" />

      <div className="modal z-40 ">
        <BasicFormAreaBG h2Text='Edit your Routine Item'  >
          <Form method='post' className='mx-8'>
            <div className="form-control gap-6 vert-space-between-inputs ">
              <div >
                <InputLabelWithGuideLineLink
                  inputTitle='Task'
                  guideLineTitle='Task'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a Routine To-Do Item"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>
            </div>

            <div className="flex justify-between my-8 gap-4">
              <div className='flex-1'>
                <SolidBtnGreyBlue
                  text='Cancel Edits'
                  onClickFunction={() => setIsEditTaskModalOpen(false)}
                />
              </div>

              <div className='flex-1'>
                <SolidBtn
                  text='Accept Edits'
                  onClickFunction={handleSave}
                  disableBtn={!isSaveable}
                />
              </div>
            </div>

          </Form>
        </BasicFormAreaBG >

        {/* <label htmlFor="my-modal-5"
              className="btn btn-outline btn-primary 
                font-mont rounded-none 
                w-40
                "
              onClick={() => setIsEditTaskModalOpen(false)}
            >Cancel Edits
            </label>
            <label htmlFor="my-modal-5"
              className="btn btn-primary 
                font-mont place-content-center 
                rounded-none w-40
                "
              onClick={handleSave}
            >Accept Edits
            </label>
          </div> */}

        {/* </div> */}
      </div >
    </>
  )
}

export default EditTaskModal