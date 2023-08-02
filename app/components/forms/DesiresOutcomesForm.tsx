import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react';

import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import { dbIcon, downArrowsIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'
import OutlinedBtn from '../buttons/OutlinedBtn';
import DndProgress from '../dnds/outcomes/progress/DndProgress';

interface DesireFormProps {
  desire?: DesireWithValues
}


function DesiresOutcomesForm({ desire }: DesireFormProps) {
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [progress, setProgress] = useState<string>('') //if adding new desire, set to desires.length
  const [progressList, setProgressList] = useState<string[]>([])


  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    setTitle(desire?.title || '')
    setDesireId(desire?.id || '')
    // setCurrent(desire?.current || '')
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !title
    // const isInputDifferent = current !== desire?.current
    // const isInputDifferent = description !== desire?.outcome.description
    setIsSaveable(!isInputEmpty)
    // setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title]);


  const handleAddEvidence = () => {
    if (progress) {
      setProgressList([...progressList, progress])
      setProgress('')
    }
  }

  return (
    <BasicFormAreaBG
      title={`Specific Outcomes for  ${title}`}
    >

      <Form method='post' className='mx-8'>
        < div className="form-control gap-6 vert-space-between-inputs">
          <input type="string" name='desireId' value={desireId} hidden readOnly />

          <div className=''>
            <InputLabel text='Outcome Title' />
            <input type="text"
              placeholder="Enter a List Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className=" input-field-text-title "
            />
              {validationErrors?.description && (
              <div className='validation-error'> {validationErrors.description}</div>
            )}
          </div>

          <div className='pb-0 mb-0 '>
            <InputLabel text='Specific Outcome' />
            <textarea
              className='input-field-text-para '
              placeholder={DesireCurrentSituation}
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
            {validationErrors?.description && (
              <div className='validation-error'> {validationErrors.description}</div>
            )}
          </div>

          <InputLabel text='Due Date' />

          <div className=' '>
            <InputLabel text='Evidence of Progress towards Outcome' />
            <input type="text"
              placeholder="Evidence"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className=" input-field-text-title "
            />
          </div>

          <OutlinedBtn
            text='Add Evidence'
            icon={downArrowsIcon}
            onClickFunction={handleAddEvidence}
            disabledBtnBoolean={isSubmitting || !isSaveable}
            daisyUIBtnColor='primary'
            type='button'
          />


         <DndProgress
            progressList={progressList }
          />

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6 mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits'}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableSaveBtn={isSubmitting || !isSaveable}
            />
          </div>
        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default DesiresOutcomesForm