import React, { useState } from 'react'
import TextBtnGuideLine from '../buttons/TextBtnGuideLine';
import BasicToolTipArea from '../baseContainers/BasicToolTipArea';
import { InfoIcon } from '../utilities/icons';

interface WithGuidelineLinkProps {
  children: React.ReactNode;
  text: string;
  guideline: string;
  title: string;

}
function WithGuidelineLink({ text, guideline, title, children }: WithGuidelineLinkProps) {

  const [showGuideLine, setShowGuideLine] = useState(false)

  function handleClose() {
    setShowGuideLine(false)
  }


  return (
    <>
      <div className=" flex justify-between items-center mb-1  w-full">
        {children && (
          <div>{children}</div>
        )}
        {guideline && (
          <div className='relative '>
            <TextBtnGuideLine
              text={" "}
              // text={"GUIDELINES"}
              type='button'
              onClickFunction={() => setShowGuideLine(true)}
              icon={InfoIcon}
            />
            {showGuideLine && (
              <BasicToolTipArea
                title={title}
                closeFunction={handleClose}
              >
                {guideline}
              </BasicToolTipArea>
            )}

          </div>
        )}
      </div >
    </>
  )
}

export default WithGuidelineLink