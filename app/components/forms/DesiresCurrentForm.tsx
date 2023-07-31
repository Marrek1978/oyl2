import { useEffect, useState } from 'react'
import { Form, useActionData, useMatches, useNavigation } from '@remix-run/react';

import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import { dbIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { Desire } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes'

interface DesireFormProps {
  desire?: DesireWithValues
}

function DesiresCurrentForm({ desire }: DesireFormProps) {

  const matches = useMatches();
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [current, setCurrent] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const isSubmitting = navigation.state === 'submitting'
  const desires: Desire[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires

  useEffect(() => {
    setTitle(desire?.title || '')
    setDesireId(desire?.id || '')
    setCurrent(desire?.currentSituation || '')
  }, [desires, desire])


  useEffect(() => {
    const isInputEmpty = !current
    const isInputDifferent = current !== desire?.currentSituation
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [current, desire?.currentSituation]);


  return (
    <BasicFormAreaBG
      title={`Current Situation for  ${title}`}
    >
      <Form method='post' className='mx-8'>
        <div className="form-control vert-space-between-inputs">
          <input type="string" name='desireId' value={desireId} hidden readOnly />

          <InputLabel text='Current Situation' />
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

export default DesiresCurrentForm