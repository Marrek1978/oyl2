import React from 'react'

import DatePicker from '~/components/list/DatePicker'
import type { CreationTodo } from '~/types/listTypes';

interface EditToDoProps {
  todo: CreationTodo | null;
  setIsEditToDoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  todos: CreationTodo[];
  updateTodo: (index: number, updatedTodo: CreationTodo) => void;
  index: number | null;
}

const EditListToDoModal: React.FC<EditToDoProps> = ({ todo, setIsEditToDoModalOpen, todos, updateTodo, index }) => {

  const [body, setBody] = React.useState<string>(todo?.body || '');
  const [urgent, setUrgent] = React.useState<boolean>(todo?.urgent || false);
  const [important, setImportant] = React.useState<boolean>(todo?.important || false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(todo?.dueDate || null);


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
        <div className="modal-box relative rounded-none  overflow-visible min-w-[500px]">

          <h3 className="font-semibold font-nanum text-2xl 
          base-content ">Edit your To-Do Item</h3>
          <div className=" w-full mt-6">
            <input type="text" placeholder="Type here"
              className="input border-none w-full bg-base-200 font-mont"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className=" flex items-center mt-4 gap-16 ">
            <div className="">
              <label className="cursor-pointer label justify-start">
                <span className="label-text mr-2 font-mont font-semibold">Urgent</span>
                <input type="checkbox"
                  className="toggle toggle-secondary"
                  checked={urgent}
                  onChange={handleIsUrgent}
                />
              </label>
            </div>

            <div className="">
              <label className="cursor-pointer label justify-start">
                <span className="label-text mr-2 font-mont font-semibold">Important</span>
                <input type="checkbox"
                  className="toggle toggle-secondary"
                  checked={important}
                  onChange={handleIsImportant}
                />
              </label>
            </div>
          </div>

          <div className='mt-4'>
            <DatePicker
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>

          <div className="modal-action flex justify-between mt-12">
            <label htmlFor="my-modal-5"
              className="btn btn-outline btn-primary 
                font-mont rounded-none 
                w-40
                "
              onClick={() => setIsEditToDoModalOpen(false)}
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

export default EditListToDoModal