import { Form, Link } from '@remix-run/react'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue'
import { closeIcon, trashIcon } from '../utilities/icons'

interface AreYouSureDeleteModalProps {
  item: string;
  title: string;
  id: string;
}

function AreYouSureDeleteModal({ item, title, id }: AreYouSureDeleteModalProps) {

  return (
    <>
      <div className="card w-[700px] 
        bg-warning
        rounded-none
        font-mont
        shadow-xl z-30
        ">
        <div className="card-body">
          <h2 className="text-2xl  text-base-content">
            Are you sure you want to delete the {item}:<br />
            <span className='underline'>{title}</span> ?
          </h2>
          <p className='mt-2'>Deleting the {item} is permament</p>
          <div className="flex gap-6 w-full justify-between mt-8">
            <Link to='..' className='w-6/12 flex gap-2 flex-1 '>
              <SolidBtnGreyBlue
                text='Cancel Delete'
                onClickFunction={() => { }}
                icon={closeIcon}
              />
            </Link>
            <div className='flex-1'>
              <Form method='post'>
                <input type="hidden" name="rowId" value={id} />
                <button
                  className="btn btn-error rounded-none w-full"
                  type='submit'
                >Delete {item} {trashIcon}
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AreYouSureDeleteModal