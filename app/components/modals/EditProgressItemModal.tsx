import { useState, useEffect } from 'react'

import SolidBtn from '../buttons/SolidBtn';
import DatePicker from '../list/DatePicker';
import InputLabel from '../forms/InputLabel'
import BasicFormAreaBG from '../forms/BasicFormAreaBG';
import { closeIcon, dbIcon } from '../utilities/icons';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';

import type { DesireOutcomeProgress } from '@prisma/client';
import type { NewlyCreatedProgress } from '~/types/progressTypes';

interface EditProgressItemModalProps {
  progress: DesireOutcomeProgress | NewlyCreatedProgress;
  handleSaveEdits: (EditedProgress: DesireOutcomeProgress | NewlyCreatedProgress) => void;
  handleCancel: () => void;
}

function EditProgressItemModal({ progress, handleCancel, handleSaveEdits }: EditProgressItemModalProps) {

  const [editedProgress, setEditedProgress] = useState<DesireOutcomeProgress | NewlyCreatedProgress>(progress)
  const [progressTitle, setProgressTitle] = useState<string>('') //if adding new desire, set to desires.length
  const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)

  const title = progress?.title
  const dueDate = progress?.dueDate


  useEffect(() => {
    setProgressTitle(title)
    setProgressDueDate(dueDate)
  }, [progress, dueDate, title])


  useEffect(() => {
    setEditedProgress(prevState => ({
      ...prevState,
      title: progressTitle,
      dueDate: progressDueDate
    }))
  }, [progressTitle, progressDueDate])


  return (
    <>
      <div className=' max-w-[550px] '>
        <BasicFormAreaBG
          title={`Edit: ${progressTitle}`}
        >
          <div className='m-8  '>
            <InputLabel text='Evidence of Progress' />
            <input type="text"
              placeholder="Evidence of Progress"
              value={progressTitle}
              onChange={(e) => setProgressTitle(e.target.value)}
              className=" input-field-text-title "
            />

            <div className='min-w-max vert-space-between-inputs'>
              <DatePicker
                setSelectedDate={setProgressDueDate}
                selectedDate={progressDueDate}
                labelText="Progress Due On or Before"
              />
            </div>

            <div className="
              w-full mt-12 
              min-w-max
              flex gap-6 justify-between 
              ">
              <div className='flex-1'>
                <SolidBtnGreyBlue
                  text='Cancel '
                  onClickFunction={handleCancel}
                  icon={closeIcon}
                />
              </div>

              <div className='flex-1'>
                <SolidBtn
                  text='Save Edits'
                  onClickFunction={() => handleSaveEdits(editedProgress)}
                  icon={dbIcon}
                />
              </div>
            </div>
          </div>
        </BasicFormAreaBG>
      </div>
    </>
  )
}

export default EditProgressItemModal