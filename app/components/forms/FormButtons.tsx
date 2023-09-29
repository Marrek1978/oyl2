import { Link } from '@remix-run/react'

import TextBtn from '../buttons/TextBtn'
import SolidBtn from '../buttons/SolidBtn'
// import OutlinedBtn from '../buttons/OutlinedBtn'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue'
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons'


type Props = {
  isNew?: boolean;
  saveBtnTxt: string;
  isSaveable: boolean;
  saveBtnType?: 'submit' | 'button';
  saveBtnOnClickFunction?: () => void;
  hideSaveBtn?: boolean;

  showCloseBtn?: boolean;
  closeBtnText?: string;
  closeBtnOnClickFunction?: () => void;
  deleteBtnText?: string;

}

function FormButtons({
  isNew = true,
  saveBtnTxt,
  isSaveable,
  saveBtnType = 'submit',
  saveBtnOnClickFunction,
  hideSaveBtn = false,
  showCloseBtn = false,
  closeBtnText = 'Close w/o saving',
  closeBtnOnClickFunction,
  deleteBtnText = 'Delete',
}: Props) {

  return (
    <>
      <div className=' w-full flex flex-wrap gap-6  '>

        {/* //! Delete Button */}
        {!isNew && (
          <div className='flex-1 min-w-[180px] self-center text-center  '>
            <Link to='delete' >
              {/* <OutlinedBtn
                text={deleteBtnText}
                onClickFunction={() => { }}
                icon={trashIcon}
                daisyUIBtnColor='error'
              /> */}
              <TextBtn
                text={deleteBtnText}
                color='error'
                icon={trashIcon}
                textColorDaisyUI={'text-error'}
              />
            </Link>
          </div>
        )}

        {/* // ?  Close Button */}
        {(!isNew || showCloseBtn) && (
          <div className='flex-1 min-w-[180px]'>
          <Link to={!closeBtnOnClickFunction ? `..` : ''} >
              <SolidBtnGreyBlue text={closeBtnText}
                onClickFunction={ closeBtnOnClickFunction || (() => { }) }
                icon={closeIcon}
              />
              
            </Link>
          </div>
        )}


        {/* // *  Save Button */}
        {!hideSaveBtn && (
          <div className='flex-1 min-w-[180px]'>
            <SolidBtn text={saveBtnTxt}
              onClickFunction={saveBtnOnClickFunction}
              icon={dbIcon}
              disableBtn={!isSaveable}
              type={saveBtnType}
            />
          </div>

        )}


      </div>
    </>
  )
}

export default FormButtons
