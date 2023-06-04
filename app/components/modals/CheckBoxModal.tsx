
import type { ListAndToDos, Todo } from '~/types/listTypes';
import ToDoWithCheckBox from '../list/todos/ToDoWithCheckBox';
import { sortTodos } from './EditListModal';
import { useEffect, useState } from 'react';
import { useList } from '../list/ListContext';
import CloseLabelBtn from '../buttons/SolidLabelClose';
import HeaderLabel from '../buttons/LabelCardHeader';
import TextBtn from '../buttons/TextBtn';
import OutlinedLabelBtn from '../buttons/OutlinedLabelBtn';
import { trashIcon, downArrowsIcon } from '../icons';
import Divider from '~/components/Divider';

interface CheckCompleteModal {
  listItem: ListAndToDos;
  closeModal: () => void;
  triggerRefreshRouteData: () => void;
  openEditListModal: () => void;
  handleUpdateListInDb: () => Promise<Response>;
  handleDeleteCompletedToDosFromList: (completedTodos: Todo[]) => Promise<Response>;
  openDeleteListModal: () => void;
}

//? dashboard -> dashboard/todos -> ListCard
// <//! prob this whol component shoudl be reusable with a color option
const CheckBoxModal: React.FC<CheckCompleteModal> = ({ listItem, closeModal, openEditListModal, triggerRefreshRouteData, handleUpdateListInDb, handleDeleteCompletedToDosFromList, openDeleteListModal }) => {

  const { listTitle, setListTitle, isRecurring, setIsRecurring, todos, setTodos } = useList();
  const [shouldUpdateDB, setShouldUpdateDB] = useState(false);

  useEffect(() => {
    setListTitle(listItem?.title || '');
    setIsRecurring(listItem?.is_recurring || false)
    setTodos(listItem?.todos || [])
  }, [listItem])

  useEffect(() => {
    if (shouldUpdateDB) {
      handleUpdateListInDb();
      setShouldUpdateDB(false);
    }
  }, [shouldUpdateDB]);

  const handleCloseCheckBoxModal = () => {
    setListTitle('');
    setIsRecurring(false);
    setTodos([]);
    closeModal()
  }

  const handleReorderToDos = async (): Promise<void> => {
    const reorderedTodos = sortTodos(todos);
    setTodos(reorderedTodos);
    setShouldUpdateDB(true);
  };

  const handleDeleteCompletedToDos = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.complete);
    handleDeleteCompletedToDosFromList(completedTodos);
  }

  return (
    <>
      <input type="checkbox" id={`checkboxes-${listItem.id}`} className="modal-toggle" />
      <div className="modal z-10 ">
        <div className="modal-box rounded-none p-0 m-0 min-w-[500px]">
          <div
            className={` w-full 
            bg-base-content
            px-8
            grid grid-cols-1 grid-rows-[24px_24px_24px]
            dark:border-neutral-600 dark:text-neutral-50
          `
            }>
            <div></div>
            <div className='flex justify-between items-center flex-none'>
              <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              w-4/5
              
              `}>
                {listTitle}
              </div>

              <HeaderLabel
                text={'Edit'}
                htmlFor={`edit-list-modal-${listItem.id}`}
                onClickFunction={openEditListModal}
                textSizeTailwindClasses={'text-md font-bold'}
              />

            </div>

            <div className='p-0 m-0 max-h-min self-end'>
              {isRecurring && <span className='text-xs text-primary-200 leading-none capitalize font-mont '>Recurring </span>}
            </div>
          </div >

          <div className='py-6 px-8 font-poppins  '>
            <div className=" max-h-[50vh] min-h-[200px] overflow-y-auto">
              {todos.map((todoItem, index) => {
                return <ToDoWithCheckBox key={todoItem.id} todoId={todoItem.id} todoItem={todoItem} index={index} triggerRefreshRouteData={triggerRefreshRouteData} />
              })}
            </div>

            <div>
              <Divider />
            </div>

            {todos.some(todo => todo.complete === true) && (
              <div className='w-full mt-8 flex justify-between items-center'>

                <div className='text-base font-mont font-semibold'>Completed To-Dos</div>
                <div>
                  {todos.filter(todo => todo.complete).length > 0
                    && todos.filter(todo => !todo.complete).length > 0
                    && (
                      <TextBtn
                        text={'Move Down'}
                        icon={downArrowsIcon}
                        onClickFunction={handleReorderToDos}
                      />
                    )}
                </div>

                <div>
                  <TextBtn
                    text={'Delete'}
                    icon={trashIcon}
                    onClickFunction={handleDeleteCompletedToDos}
                    color={'error'}
                  />
                </div>
              </div>
            )}


            <div className=' w-full mt-8 '>
              <CloseLabelBtn
                text={'Close'}
                onClickFunction={handleCloseCheckBoxModal}
                htmlFor={`checkboxes-${listItem.id}`}
              />
            </div>

            <div className=' w-full mt-6 '>
              <OutlinedLabelBtn
                text={'Delete this List'}
                htmlFor={'delete-list-modal'}
                icon={trashIcon}
                onClickFunction={openDeleteListModal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckBoxModal