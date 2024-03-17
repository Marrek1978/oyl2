import { Form } from '@remix-run/react'
import FormButtons from '~/components/buttons/FormButtons';
import useGetNavigationState from '~/components/utilities/useNavigationState';

interface AreYouSureDeleteModalProps {
  item: string;
  title: string;
  id: string;
}

function AreYouSureDeleteModal({ item, title, id }: AreYouSureDeleteModalProps) {
  
  const { isIdle } = useGetNavigationState()

  return (
    <>
      <div className="card w-[700px] 
        bg-warning
        rounded-none
        font-mont
        shadow-xl z-30
        text-warning-content
        ">
        <div className="card-body">
          <h2 className="text-2xl">
            Are you sure you want to delete the {item}:<br />
            <span className='underline whitespace-normal'>{title}</span> ?
          </h2>

          <p className='mt-2'>Deleting the {item} is permament</p>

          <div className="  mt-8">
            <Form method='POST'>
              <input type="hidden" name="rowId" value={id} />
              <FormButtons
                isShowSaveBtn={false}
                isShowDeleteBtn={true}
                isNew={false}
                isDeleteBtnOutlined={false}
                isDeleteBtnDisabled={!isIdle}
                deleteBtnLink=''
              />
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AreYouSureDeleteModal