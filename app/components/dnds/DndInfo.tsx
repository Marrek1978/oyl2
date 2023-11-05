import { useState } from 'react'

import { InfoIcon } from '../utilities/icons'
import { DndGuideline } from '../utilities/Guidelines'
import TextBtnGuideLine from '../buttons/TextBtnGuideLine'
import BasicToolTipArea from '../baseContainers/BasicToolTipArea'

function DndInfo() {
  const [showDndInfo, setShowDndInfo] = useState(false)

  function handleClose() {
    setShowDndInfo(false)
  }


  return (
    <>
      <div className=" flex justify-end items-center    w-full">
        <div className='relative '>
          <TextBtnGuideLine
            text={"DnD"}
            type='button'
            onClickFunction={() => setShowDndInfo(true)}
            icon={InfoIcon}
            textForIcon='DnD'
          />
          {showDndInfo && (
            <BasicToolTipArea
              title={'Dnd'}
              closeFunction={handleClose}
            >
              {DndGuideline}
            </BasicToolTipArea>
          )}

        </div>
      </div >
    </>
  )
}


export default DndInfo