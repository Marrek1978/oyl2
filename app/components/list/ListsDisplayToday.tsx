import { useState } from 'react'

import Modal from '../modals/Modal'
import TextBtn from '../buttons/TextBtn'
import { EditIcon } from '../utilities/icons'


import type { ListAndToDos } from '~/types/listTypes'
import TodosCompletedForm from '../forms/CompletedTodosForm'


type Props = {
  lists: ListAndToDos[]
}

function RoutinesDisplayToday({ lists }: Props) {

  const [list, setList] = useState<ListAndToDos>()
  const [openTodosCompleteModal, setOpenTodosCompleteModal] = useState<boolean>(false)

  const handleClick = (listId: string) => {
    // Handle click event
    const listToOpen = lists.find(list => list.id === listId)
    setList(listToOpen)
    setOpenTodosCompleteModal(true)

  };

  return (
    <>

      {openTodosCompleteModal && list && (
        <Modal onClose={() => { }} zIndex={10}  >
          <TodosCompletedForm list={list} />
        </Modal>
      )}

      <div className=''>
        {lists.map((list) => (
          <div
            key={list.id}
            className='text-primary'
            onClick={() => handleClick(list.id)}
          >
            <TextBtn
              text={list.title}
              onClickFunction={() => { }}
              icon={EditIcon}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default RoutinesDisplayToday