import { Link } from '@remix-run/react'

import SolidBtn from '../buttons/SolidBtn'
import OutlinedBtn from '../buttons/OutlinedBtn'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue'
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons'


type Props = {
  saveBtnTxt:string;
  isSaveable:boolean;
  isNew?:boolean;
}

function FormButtons({saveBtnTxt, isSaveable, isNew=true}: Props) {
  return (
   <>
    <div className='vert-space-between-inputs mb-8 w-full'>
            <SolidBtn text={saveBtnTxt}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableBtn={!isSaveable}
            />

            {!isNew &&
              (<>
                <div className='two-button-spacing vert-space-between-inputs mb-8'>
                  <div className='flex-1'>
                    <Link to='delete' >
                      <OutlinedBtn
                        text='Delete Value'
                        onClickFunction={() => { }}
                        icon={trashIcon}
                        daisyUIBtnColor='error'
                      />
                    </Link>
                  </div>

                  <div className='flex-1'>
                    <Link to='..' >
                      <SolidBtnGreyBlue text='Close w/o saving'
                        onClickFunction={() => { }}
                        icon={closeIcon}
                      />
                    </Link>
                  </div>
                </div>
              </>)}
          </div>
          </>
  )
}

export default FormButtons
