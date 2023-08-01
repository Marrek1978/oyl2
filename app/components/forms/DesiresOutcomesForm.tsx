import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react';

import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import { dbIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'

interface DesireFormProps {
  desire?: DesireWithValues
}


function DesiresOutcomesForm({desire}: DesireFormProps) {
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
      title={`Specific Outcomes for  ${title}`}
    >

      dnd area 
      inptu field
      <Form method='post' className='mx-8'>
        <div className="form-control vert-space-between-inputs">
          <input type="string" name='desireId' value={desireId} hidden readOnly />

          <InputLabel text='Specific Outcome' />
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


        <InputLabel text='DnD Area of Progress Milestones' />


        {/* //**************BUTTONS ***************  */}
        <div className='mt-6 mb-8'>
          <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits'}
            onClickFunction={() => { }}
            icon={dbIcon}
            disableSaveBtn={isSubmitting || !isSaveable}
          />
        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default DesiresOutcomesForm