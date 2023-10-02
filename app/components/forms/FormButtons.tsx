import { Link } from '@remix-run/react'

import BtnWithProps from '../buttons/BtnWithProps'

import type { MouseEventHandler } from 'react'
import type { DaisyUIBtnColor, DaisyUIBtnSize, DaisyUIColor, TWTextSizes } from '~/types/CSSTypes'


type Props = {
  textSizeTW?: TWTextSizes;
  isNew?: boolean;

  isShowSaveBtn?: boolean;
  saveBtnText?: string;
  saveBtnType?: 'submit' | 'button';
  saveBtnOnClickFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  saveBtnOnMouseOver?: MouseEventHandler<HTMLButtonElement>;
  saveBtnOnMouseOut?: MouseEventHandler<HTMLButtonElement>;
  isSaveBtnDisabled?: boolean
  isSaveBtnOutlined?: boolean
  saveBtnIcon?: React.ReactNode
  saveBtnTextColorDaisyUI?: DaisyUIColor;
  saveBtnDaisyUIBtnColor?: DaisyUIBtnColor;
  saveBtnDaisyUIBtnSize?: DaisyUIBtnSize;

  isShowCloseBtn?: boolean;
  closeBtnText?: string;
  closeBtnType?: 'submit' | 'button';
  closeBtnOnClickFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  closeBtnOnMouseOver?: MouseEventHandler<HTMLButtonElement>;
  closeBtnOnMouseOut?: MouseEventHandler<HTMLButtonElement>;
  isCloseBtnDisabled?: boolean
  isCloseBtnOutlined?: boolean
  closeBtnIcon?: React.ReactNode
  closeBtnTextColorDaisyUI?: DaisyUIColor;
  closeBtnDaisyUIBtnColor?: DaisyUIBtnColor;
  closeBtnDaisyUIBtnSize?: DaisyUIBtnSize;

  isShowDeleteBtn?: boolean;
  deleteBtnType?: 'submit' | 'button';
  deleteBtnText?: string;
  deleteBtnOnClickFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  deleteBtnOnMouseOver?: MouseEventHandler<HTMLButtonElement>;
  deleteBtnOnMouseOut?: MouseEventHandler<HTMLButtonElement>;
  isDeleteBtnDisabled?: boolean
  isDeleteBtnOutlined?: boolean
  deleteBtnIcon?: React.ReactNode
  deleteBtnTextColorDaisyUI?: DaisyUIColor;
  deleteBtnDaisyUIBtnColor?: DaisyUIBtnColor;
  deleteBtnDaisyUIBtnSize?: DaisyUIBtnSize;
}

function FormButtons({
  textSizeTW,
  isNew = true,
  
  isShowSaveBtn = true,
  saveBtnText,
  saveBtnType = 'submit',
  saveBtnOnClickFunction,
  saveBtnOnMouseOver,
  saveBtnOnMouseOut,
  isSaveBtnDisabled,
  isSaveBtnOutlined,
  saveBtnIcon,
  saveBtnTextColorDaisyUI,
  saveBtnDaisyUIBtnColor,
  saveBtnDaisyUIBtnSize,

  isShowCloseBtn = true,
  closeBtnType = 'button',
  closeBtnText,
  closeBtnOnClickFunction,
  closeBtnOnMouseOver,
  closeBtnOnMouseOut,
  isCloseBtnDisabled,
  isCloseBtnOutlined,
  closeBtnIcon,
  closeBtnTextColorDaisyUI,
  closeBtnDaisyUIBtnColor,
  closeBtnDaisyUIBtnSize,

  isShowDeleteBtn = true,
  deleteBtnType = 'submit',
  deleteBtnText,
  deleteBtnOnClickFunction,
  deleteBtnOnMouseOver,
  deleteBtnOnMouseOut,
  isDeleteBtnDisabled,
  isDeleteBtnOutlined = true,
  deleteBtnIcon,
  deleteBtnTextColorDaisyUI,
  deleteBtnDaisyUIBtnColor,
  deleteBtnDaisyUIBtnSize,

}: Props) {

  return (
    <>
      <div className=' w-full flex flex-wrap gap-6  '>

        {/* //! Delete Button */}
        {!isNew && isShowDeleteBtn && (
          <div className='flex-1 min-w-[180px] self-center text-center  '>
            <Link to='delete' >
              <BtnWithProps
                btnPurpose='delete'
                btnLabel={deleteBtnText}
                btnType={deleteBtnType}
                onClickFunction={deleteBtnOnClickFunction || (() => { })}
                onMouseOver={deleteBtnOnMouseOver}
                onMouseOut={deleteBtnOnMouseOut}
                isBtnDisabled={isDeleteBtnDisabled}
                isOutlined={isDeleteBtnOutlined}
                icon={deleteBtnIcon}
                textSizeTW={textSizeTW}
                textColorDaisyUI={deleteBtnTextColorDaisyUI}
                daisyUIBtnColor={deleteBtnDaisyUIBtnColor}
                daisyUIBtnSize={deleteBtnDaisyUIBtnSize}
              />
            </Link>
          </div>
        )}

        {/* // ?  Close Button */}
        {(isShowCloseBtn ) && (
          <div className='flex-1 min-w-[180px]'>
            <Link to={!closeBtnOnClickFunction ? `..` : ''} >
              <BtnWithProps
                btnPurpose='close'
                btnLabel={closeBtnText}
                btnType={closeBtnType}
                onClickFunction={closeBtnOnClickFunction || (() => { })}
                onMouseOver={closeBtnOnMouseOver}
                onMouseOut={closeBtnOnMouseOut}
                isBtnDisabled={isCloseBtnDisabled}
                isOutlined={isCloseBtnOutlined}
                icon={closeBtnIcon}
                textSizeTW={textSizeTW}
                textColorDaisyUI={closeBtnTextColorDaisyUI}
                daisyUIBtnColor={closeBtnDaisyUIBtnColor}
                daisyUIBtnSize={closeBtnDaisyUIBtnSize}
              />
            </Link>
          </div>
        )}


        {/* // *  Save Button */}
        { isShowSaveBtn && (
          <div className='flex-1 min-w-[180px]'>
            <BtnWithProps
              btnPurpose='save'
              btnLabel={saveBtnText}
              onClickFunction={saveBtnOnClickFunction}
              btnType={saveBtnType}
              isBtnDisabled={isSaveBtnDisabled}
              onMouseOver={saveBtnOnMouseOver}
              onMouseOut={saveBtnOnMouseOut}
              isOutlined={isSaveBtnOutlined}
              icon={saveBtnIcon}
              textSizeTW={textSizeTW}
              textColorDaisyUI={saveBtnTextColorDaisyUI}
              daisyUIBtnColor={saveBtnDaisyUIBtnColor}
              daisyUIBtnSize={saveBtnDaisyUIBtnSize}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default FormButtons
