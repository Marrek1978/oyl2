import React, { useEffect, useRef, useState } from 'react'

import DatePicker from '~/components/list/DatePicker'
// import '~/styles/DatePicker.css';
import EditToDoModal from "~/components/modals/EditToDoModal";
import type { CreationTodo, ListAndToDos, Todo } from '~/types/listTypes';
import { v4 as uuidv4 } from "uuid";
import { useList } from '../list/ListContext';

import { SortableItem } from '~/components/list/todos/SortableItem'
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import CloseLabelBtn from '../buttons/SolidLabelClose';
import { dbIcon, trashIcon, downArrowsIcon, ArrowIcon45deg, ArrowIconUp } from '../icons';
import Divider from '../Divider';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidLabelBtn from '../buttons/SolidLabelBtn';


interface EditListModalProps {
  saveEditsFunction: () => Promise<Response>;
  listItem: ListAndToDos;
  closeEditListModal: () => void;
}

const EditListModal: React.FC<EditListModalProps> = ({
  saveEditsFunction,
  listItem,
  closeEditListModal
}) => {

  const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();

  useEffect(() => {
    setListTitle(listItem?.title || '');
    setIsRecurring(listItem?.is_recurring || false)
    setTodos(listItem?.todos || [])
  }, [])

  const inputToDoRef = useRef<HTMLInputElement>(null);
  const [selectedTodo, setSelectedTodo] = useState<CreationTodo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [isEditToDoModalOpen, setIsEditToDoModalOpen] = useState(false);

  const addToDoToList = (newTodo: string) => {
    const id = uuidv4();
    const todo: CreationTodo = {
      id,
      body: newTodo,
      urgent: isUrgent,
      important: isImportant,
      complete: false,
      dueDate: selectedDate || null,
      sortOrder: null
    }
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, todo];
      return sortTodos(updatedTodos);
    });
  };

  const handleAddToList = () => {
    if (inputToDoRef.current?.value) {
      addToDoToList(inputToDoRef.current.value);
      inputToDoRef.current.value = '';
      setIsUrgent(false);
      setIsImportant(false);
      setSelectedDate(null);
    }
  }

  const updateTodo = (index: number | null, updatedTodo: CreationTodo) => {
    setTodos(todos.map((todo, i) => (i === index ? updatedTodo : todo)));
  };

  const removeTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const handleIsUrgent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUrgent) {
      isImportant && setIsImportant(false)
    }
    setIsUrgent(e.target.checked)
  }

  const handleIsImportant = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isImportant) {
      isUrgent && setIsUrgent(false)
    }
    setIsImportant(e.target.checked)
  }

  const handleIsRecurring = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRecurring(e.target.checked)
  }

  const handleOpenModal = (todoId: string) => {
    const todo = todos.find(todo => todo.id === todoId) || null;
    const index = todos.findIndex(todo => todo.id === todoId);
    setSelectedTodoIndex(index);
    setSelectedTodo(todo)
    console.log('handleOpenModal')
    setIsEditToDoModalOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {

    const response = await saveEditsFunction()
    if (response.ok) {
      clearState()
      setIsEditToDoModalOpen(false)
    }
  }

  const clearState = () => {
    setListTitle('')
    setTodos([])
    setSelectedTodo(null)
    setSelectedTodoIndex(null)
    setSelectedDate(null)
    setIsUrgent(false)
    setIsImportant(false)
    setIsRecurring(false)
  }

  // const handleCloseEditListModal = () => {
  //   clearState()
  //   closeEditListModal()
  // }

  return (
    <>
      <input type="checkbox" id={`edit-list-modal-${listItem.id}`} className="modal-toggle" />

      <div className="modal rounded-none z-20 w-full">
        <div className="modal-box rounded-none min-w-[900px] pt-0 pl-6 pb-6 pr-0">
          <div className='sm:flex gap-12'>

            <section id='edit-list-form' className='flex flex-col min-w-[350px] max-w-[400px] '>
              <div className='
                font-semibold font-nanum text-2xl 
                base-content 
                h-[72px] flex items-center 
                '>Edit your List
              </div>
              <Divider />
              <div className="mt-6">
                <div className="form-control mt-0">
                  <label className="label">
                    <span className="label-text text-base font-mont font-semibold">List Title</span>
                  </label>
                  <input type="text"
                    placeholder="Enter a List Title"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    className="input border-none input-secondary 
                    bg-base-200 rounded-none
                    font-poppins font-normal tracking-wide
                    "
                  />
                  <label className="label">
                    {!listTitle &&
                      <span className="label-text-alt text-error">
                        <div className='flex gap-2'>
                          {ArrowIconUp}
                          A List must have a Title
                        </div>
                      </span>
                    }
                  </label>
                </div>

                <div className="">
                  <label className="cursor-pointer label justify-start" >
                    <span className="label-text mr-2 font-mont font-semibold">Recurring List</span>
                    <input type="checkbox"
                      className="toggle toggle-secondary"
                      checked={isRecurring}
                      onChange={handleIsRecurring}
                    />
                  </label>
                </div>
              </div>

              <div className='my-8'>
                <Divider />
              </div>

              <div className="form-control mt-0 pt-0">
                <label className="label pt-0 pl-0">
                  <span className="label-text text-base font-mont font-semibold">Add To-do</span>
                </label>
                <input type="text"
                  placeholder="Enter a To-Do"
                  ref={inputToDoRef}
                  className="input border-none input-secondary  
                      bg-base-200
                      rounded-none
                      font-poppins font-normal tracking-wide
                    " />
              </div>

              <div className="flex gap-12 items-center pt-0 mt-4 flex-wrap">
                <div className="">
                  <label className="cursor-pointer label justify-start">
                    <span className="label-text mr-2 font-mont font-semibold">Urgent</span>
                    <input type="checkbox"
                      className="toggle toggle-secondary"
                      checked={isUrgent}
                      onChange={handleIsUrgent}
                    />
                  </label>
                </div>

                <div className="">
                  <label className="cursor-pointer label justify-start">
                    <span className="label-text mr-2 font-mont font-semibold">Important</span>
                    <input type="checkbox"
                      className="toggle toggle-secondary"
                      checked={isImportant}
                      onChange={handleIsImportant}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4" >
                <DatePicker
                  setSelectedDate={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>

              <div className="mt-8" >
                <OutlinedBtn
                  text='Add to List'
                  onClickFunction={handleAddToList}
                  icon={ArrowIcon45deg}
                  daisyUIBtnColor='primary'
                />
              </div>

              <Divider />
            </section>

            <section className='min-w-[450px] max-w-[500px]'  >
              <div className={`
                overflow-hidden px-6
                bg-base-content 
                font-mont uppercase tracking-[.25em] text-xl
                cursor-default
                grid grid-cols-1 grid-rows-[24px_24px_24px]
                ${!listTitle ? 'text-neutral-content' : ' text-primary-200'}
              `}>
                <div></div>
                {listTitle ?
                  <>
                    <div className='truncate text-ellipsis  whitespace-nowrap' > {listTitle}</div>
                  </>
                  :
                  <>
                    <div className='flex gap-3 leading-none h-min'>
                      <div className='self-center'> Enter a title</div>
                    </div>
                  </>}
                <div className='p-0 m-0 max-h-min self-end'>
                  {isRecurring && <span className='text-xs text-primary-200 leading-none capitalize '>Recurring </span>}
                </div>
              </div>

              <div className='flex flex-col justify-between px-6 m-auto '>
                <div className='min-h-[442px] max-h-[442px] overflow-auto overflow-x-hidden pt-6 '>
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                  >
                    <SortableContext
                      items={todos?.map(todo => todo.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {todos?.map((todo) => (
                        <SortableItem
                          key={todo.id}
                          id={todo.id}
                          todo={todo}
                          removeTodo={removeTodo}
                          handleOpenModal={handleOpenModal} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                {listTitle && todos.length > 0 && (
                  <>

                    <SolidLabelBtn
                      text='Save Edits and Close'
                      onClickFunction={handleSubmit}
                      htmlFor={`edit-list-modal-${listItem.id}`}
                      icon={dbIcon}
                      daisyUIBtnColor='primary'
                    />

                  </>)}
              
                <div className='mt-6'>
                  <CloseLabelBtn
                    text=' Close Without Saving Edits'
                    onClickFunction={closeEditListModal}
                    htmlFor={`edit-list-modal-${listItem.id}`}
                  />
                </div>
              </div>
            </section>
          </div >
        </div >
      </div >

      {isEditToDoModalOpen && (
        <EditToDoModal
          todo={selectedTodo}
          setIsEditToDoModalOpen={setIsEditToDoModalOpen}
          todos={todos}
          updateTodo={updateTodo}
          index={selectedTodoIndex}
        />
      )}
    </>
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTodos((prevTodos: CreationTodo[]) => {
        const oldIndex = prevTodos.findIndex(todo => todo.id === active.id);
        const newIndex = prevTodos.findIndex(todo => todo.id === over?.id);
        const newTodos = arrayMove(prevTodos, oldIndex, newIndex);
        return resetTodoSortOrder(newTodos)
      });
    }
  }
}

export default EditListModal


export function sortTodos(todos: Todo[]): Todo[] {

  const todosCopy = [...todos]

  todosCopy.sort((a, b) => {
    // Put completed todos at the bottom
    if (a.complete && !b.complete) {
      return 1;
    } else if (!a.complete && b.complete) {
      return -1;
    }
    else if (a.urgent && !b.urgent) {
      return -1;
    } else if (!a.urgent && b.urgent) {
      return 1;
    }
    else if (a.important && !b.important) {
      return -1;
    } else if (!a.important && b.important) {
      return 1;
    }
    else {
      return 0
    }
  });

  return resetTodoSortOrder(todosCopy)
}

function resetTodoSortOrder(todos: CreationTodo[]): CreationTodo[] {
  return todos.map((todo, index) => {
    return {
      ...todo,
      sortOrder: index,
    }
  })
}