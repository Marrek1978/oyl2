import React, { useEffect, useState } from 'react'
import type { CreationRoutineToDo } from '~/types/routineTypes'
import BasicFormAreaBG from '../forms/BasicFormAreaBG';
import { Form } from '@remix-run/react';
import { DesireOutcomeGuideline } from '../utilities/Guidelines';
import InputLabelWithGuideLineLink from '../forms/InputLabelWithGuideLineLink';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import SolidBtn from '../buttons/SolidBtn';

interface EditRoutineToDoProps {
  todo: CreationRoutineToDo | null;
  setIsEditRoutineToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateRoutineToDo: (index: number, todo: CreationRoutineToDo) => void;
  index: number | null;
}

const EditRoutineToDoModal: React.FC<EditRoutineToDoProps> = ({ todo, setIsEditRoutineToDoModalOpen, updateRoutineToDo, index }) => {

  const [body, setBody] = useState<string>(todo?.body || '');
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty


  useEffect(() => {
    setIsSaveable(body !== todo?.body)
  }, [body, todo]);


  const handleSave = () => {
    if (todo === null || index === null) {
      return;
    }
    const updatedTodo: CreationRoutineToDo = {
      ...todo,
      body,
    };

    updateRoutineToDo(index, updatedTodo);
    setIsEditRoutineToDoModalOpen(false);
  }


  return (
    <>
      <input type="checkbox"
        id={`edit-todo-modal-${todo?.id}`}
        className="modal-toggle" />

      <div className="modal z-40 ">
        <BasicFormAreaBG
          title='Edit your Routine Item'
        >
          <Form method='post' className='mx-8'>
            <div className="form-control gap-6 vert-space-between-inputs ">
              <div >
                <InputLabelWithGuideLineLink
                  text='To Do Item'
                  title='To Do Item'
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
                  onClickFunction={() => setIsEditRoutineToDoModalOpen(false)}
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
              onClick={() => setIsEditRoutineToDoModalOpen(false)}
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

export default EditRoutineToDoModal