import { useEffect, useState } from 'react'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import { closeIcon, dbIcon } from '../utilities/icons';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';


import type { DesireWithValues } from '~/types/desireTypes'
import { DesireCurrentSituationGuideLine } from '../utilities/Guidelines';
interface DesireFormProps {
  desire?: DesireWithValues
}

function DesiresCurrentForm({ desire }: DesireFormProps) {

  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [current, setCurrent] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    setTitle(desire?.title || '')
    setDesireId(desire?.id || '')
    setCurrent(desire?.current || '')
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !current
    const isInputDifferent = current !== desire?.current
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [current, desire]);


  return (
    <BasicFormAreaBG
      title={
        <>
          <div >
            <span className='text-sm' >
              Current Situation for:
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
            text='Current Situation'
            guideline={DesireCurrentSituationGuideLine}
            title={'Current Situation'}
          />
          <textarea
            className='input-field-text-para '
            placeholder={DesireCurrentSituation}
            name='currentSituation'
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          >
          </textarea>
          {validationErrors?.description && (
            <div className='validation-error'> {validationErrors.description}</div>
          )}
        </div>

        {/* //**************BUTTONS ***************  */}
        <div className='mt-6 mb-8 flex flex-col gap-4 '>

          <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits to Current Situation'}
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
    </BasicFormAreaBG>
  )
}

export default DesiresCurrentForm