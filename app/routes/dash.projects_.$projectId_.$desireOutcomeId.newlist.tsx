import React from 'react'
import TodosListForm from '~/components/forms/TodosListForm'
import Modal from '~/components/modals/Modal'

type Props = {}

function NewListForProjectOutcomePage({ }: Props) {
  return (
    <>
      <Modal onClose={() => { }}>
        <TodosListForm
          isNew={true}
          isProject={true} />
      </Modal>


    </>
  )
}

export default NewListForProjectOutcomePage