import React from 'react'
import CloseLabelBtn from '../buttons/SolidLabelClose'
import { trashIcon } from '../icons'
import SolidLabelBtn from '../buttons/SolidLabelBtn'


interface DeleteListModalProps {
  closeDeleteListModal: () => void;
  handleDeleteList: () => void;

}
function DeleteListModal({ closeDeleteListModal, handleDeleteList }: DeleteListModalProps) {
  return (
    <>
      <input type="checkbox" id="delete-list-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-8 rounded-none ">
          <h3 className="font-bold text-xl font-nanum">Are you sure you want to permanently delete this List?</h3>
          <div className="mt-8 w-full flex justify-between flex-wrap gap-2">
            <div className=''>
              <CloseLabelBtn
                text={'Cancel Delete'}
                htmlFor={'delete-list-modal'}
                onClickFunction={closeDeleteListModal}
              />
            </div>
            <div className=''>
              <SolidLabelBtn
                text={'Delete List'}
                htmlFor={'delete-list-modal'}
                onClickFunction={handleDeleteList}
                icon={trashIcon}
                daisyUIBtnColor={'error'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteListModal