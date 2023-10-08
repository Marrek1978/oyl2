
import { useEffect, useMemo, useState } from 'react';
import { Form, } from '@remix-run/react';

import FormButtons from './FormButtons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireIdealGuideline } from '../utilities/Guidelines';
import useGetNavigationState from '../utilities/useNavigationState';
import { headerText, useSaveBtnText } from './FormsCommonFunctions';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { OutcomeDescriptionDefaultText } from '../utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'

interface DesireFormProps {
  desire?: DesireWithValues
  isNew?: boolean
}


function DesiresIdealForm({ desire, isNew = false }: DesireFormProps) {

  const [ideal, setIdeal] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()
  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Desire')
  const headerTxt = useMemo(() => headerText(isNew, 'Current Situation for: ', desire?.title || ''), [isNew, desire?.title])


  useEffect(() => {
    setDesireId(desire?.id || '')
    setIdeal(desire?.ideal || '')
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !ideal
    const isInputDifferent = ideal !== desire?.ideal
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [ideal, desire]);


  return (
    <div className='formWidth '>
      <BasicFormAreaBG h2Text={headerTxt}  >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={desireId} hidden readOnly />

            <div>
              <InputLabelWithGuideLineLink
                inputTitle='Ideal Scenario'
                guideline={DesireIdealGuideline}
                guideLineTitle='Ideal Scenario'
              />
              <textarea
                className='input-field-text-para '
                placeholder={OutcomeDescriptionDefaultText}
                name='ideal'
                value={ideal}
                onChange={(e) => setIdeal(e.target.value)}
              >
              </textarea>
            </div>


            upload images Here

            {/* //**************BUTTONS ***************  */}
            <div className='mt-2 '>
              <FormButtons
                saveBtnText={saveBtnTxt}
                isSaveBtnDisabled={!isSaveable || !isIdle}
                isNew={isNew}
                isShowCloseBtn={!isNew}
                isShowDeleteBtn={false}
              />
            </div>
          </div>
        </Form>
      </ BasicFormAreaBG>
    </div >
  )
}

export default DesiresIdealForm