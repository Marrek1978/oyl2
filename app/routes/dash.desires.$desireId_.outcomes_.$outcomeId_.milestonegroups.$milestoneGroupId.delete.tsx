import React from 'react'
import AreYouSureDeleteModal from '~/components/modals/AreYouSureDeleteModal'
import Modal from '~/components/modals/Modal'

type Props = {}

function DeleteMilestonePage({}: Props) {
  return (
   <>
    <Modal
      onClose={() => { }}
      zIndex={40}
    >
      < AreYouSureDeleteModal
        item={'to-do list'}
        title={'delete this'}
        id={'aasdfasdf'}
      />
    </Modal>
    </>
  )
}

export default DeleteMilestonePage