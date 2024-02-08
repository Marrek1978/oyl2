import { Form } from '@remix-run/react'
import React from 'react'
import FormButtons from '~/components/forms/FormButtons'
import Modal from '~/components/modals/Modal'

function PastDuePage() {
  return (
    <Modal onClose={() => { }} zIndex={20}>

<div className="card w-[700px] 
        bg-warning
        rounded-none
        font-mont
        shadow-xl z-30
        text-warning-content
        ">
        <div className="card-body">
          <h2 className="text-2xl">
            Are you sure you want to delete the  :<br />
            <span className='underline whitespace-normal'></span> ?
          </h2>

          <p className='mt-2'>Deleting the  is permament</p>

          <div className="  mt-8">
            <Form method='POST'>
              <input type="hidden" name="rowId" value={3} />
              <FormButtons
                isShowSaveBtn={false}
                isShowDeleteBtn={true}
                isNew={false}
                isDeleteBtnOutlined={false}
                isDeleteBtnDisabled={false}
                deleteBtnLink=''
              />
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PastDuePage