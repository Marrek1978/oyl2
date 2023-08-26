
import { useEffect, useState } from 'react';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import { closeIcon, dbIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireIdealExplainationText, DesireIdealPlaceholderText } from '../utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireIdealGuideline } from '../utilities/Guidelines';


interface DesireFormProps {
  desire?: DesireWithValues
}


function DesiresIdealForm({ desire }: DesireFormProps) {
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [ideal, setIdeal] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    setTitle(desire?.title || '')
    setDesireId(desire?.id || '')
    setIdeal(desire?.ideal || DesireIdealExplainationText)
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !ideal
    const isInputDifferent = ideal !== desire?.ideal
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [ideal, desire]);


  return (
    <BasicFormAreaBG
      title={
        <>
          <div >
            <span className='text-sm' >
              Ideal Scenario for:
            </span>
          </div>
          <div>
            {title}
          </div>
        </>}
    >
      <Form method='post' className='mx-8'>
        <div className="form-control vert-space-between-inputs">
          <input type="string" name='desireId' value={desireId} hidden readOnly />

          <InputLabelWithGuideLineLink
            text='Ideal Scenario'
            guideline={DesireIdealGuideline}
            title='Ideal Scenario'
          />
          <textarea
            className='input-field-text-para '
            placeholder={DesireIdealPlaceholderText}
            name='ideal'
            value={ideal}
            onChange={(e) => setIdeal(e.target.value)}
          >
          </textarea>
          {validationErrors?.description && (
            <div className='validation-error'> {validationErrors.description}</div>
          )}
        </div>


        upload images Here

        {/* //**************BUTTONS ***************  */}
        <div className='mt-6 mb-8 flex flex-col gap-4 '>
          <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits to Ideal Scenario'}
            onClickFunction={() => { }}
            icon={dbIcon}
            disableBtn={isSubmitting || !isSaveable}
          />

          <Link to='..' >
            <SolidBtnGreyBlue text='Close w/o saving'
              onClickFunction={() => { }}
              icon={closeIcon}
            />
          </Link>
        </div>
      </Form>
    </ BasicFormAreaBG>
  )
}

export default DesiresIdealForm