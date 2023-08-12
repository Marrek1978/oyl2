import React, { useState } from 'react'
import TextBtnGuideLine from '../buttons/TextBtnGuideLine';
import BasicToolTipArea from '../baseContainers/BasicToolTipArea';

interface WithGuidelineLinkProps {
  children: React.ReactNode;
  text: string;
  guideline: string;
  title: string;

}
function WithGuidelineLink({ text, guideline, title, children }: WithGuidelineLinkProps) {

  const [showGuideLine, setShowGuideLine] = useState(false)

  function handleClose() {
    console.log('handleClose')
    setShowGuideLine(false)
  }


  return (
    <>
      <div className="w-full flex justify-between items-baseline
      ">
        {children && (
          <div>{children}</div>
        )}
        {guideline && (
          <div className='relative '>
            <TextBtnGuideLine
              text={"GUIDELINES"}
              type='button'
              onClickFunction={() => setShowGuideLine(true)}
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