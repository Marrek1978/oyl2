import React from 'react'
import type { CreationRoutineToDo } from '~/types/routineTypes'

interface EditRoutineToDoProps {
  todo: CreationRoutineToDo | null;
  setIsEditRoutineToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateRoutineToDo: (index: number, todo: CreationRoutineToDo) => void;
  index: number | null;
}

const EditRoutineToDoModal: React.FC<EditRoutineToDoProps> = ({ todo, setIsEditRoutineToDoModalOpen, updateRoutineToDo, index }) => {

  const [body, setBody] = React.useState<string>(todo?.body || '');

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
        <div className="modal-box relative rounded-none  overflow-visible min-w-[500px]">

          <h3 className="font-semibold font-nanum text-2xl base-content ">
            Edit your To-Do Item
          </h3>
          <div className=" w-full mt-6">
            <input type="text" placeholder="Type here"
              className="input border-none w-full bg-base-200 font-mont"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="modal-action flex justify-between mt-12">
            <label htmlFor="my-modal-5"
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
          </div>

        </div>
      </div>
    </>
  )
}

export default EditRoutineToDoModal