import  { useState } from 'react'
import { closeIcon } from '../utilities/icons';
import TextBtnGuideLine from '../buttons/TextBtnGuideLine';

interface InputLabelWithGuideLineLinkProps {
  text: string;
  guideline?: string;
}

function InputLabelWithGuideLineLink({ text, guideline }: InputLabelWithGuideLineLinkProps) {

  const [showGuideLine, setShowGuideLine] = useState(false)

  return (
    <>
      <div className="w-full flex justify-between items-baseline ">
        <label className="label pl-0">
          <span className="label-text text-base font-mont font-semibold">{text}</span>
        </label>
        {guideline && (
          <div className='relative'>
            <TextBtnGuideLine
              text={"GUIDELINES"}
              type='button'
              onMouseOver={() => setShowGuideLine(true)}
              onClickFunction={() => { }}
            />

            {showGuideLine && (
              <div className='absolute top-[100%] right-00 '>
                <div className="tooltip tooltip-open tooltip-warning rounded-none" data-tip={guideline}>
                  <button 
                    className="btn btn-warning rounded-none"
                    onClick={() => setShowGuideLine(false)}
                    >Close {closeIcon} </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div >

    </>
  )
}


export default InputLabelWithGuideLineLink