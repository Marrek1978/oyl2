import { Form, } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react'

import FormButtons from '~/components/forms/FormButtons';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';
import { DesireCurrentSituationGuideLine } from '~/components/utilities/Guidelines';
import { headerText, useSaveBtnText } from '~/components/forms/FormsCommonFunctions';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';

import type { DesireWithValues } from '~/types/desireTypes'


interface DesireFormProps {
  desire?: DesireWithValues
  isNew?: boolean
}

function DesiresCurrentForm({ desire, isNew = false }: DesireFormProps) {

  const [current, setCurrent] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()
  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Desire')
  const headerTxt = useMemo(() => headerText(isNew, 'Current Situation for: ', desire?.title || ''), [isNew, desire?.title])


  useEffect(() => {
    setDesireId(desire?.id || '')
    setCurrent(desire?.current || '')
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !current
    const isInputDifferent = current !== desire?.current
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [current, desire]);


  return (
    <div className=' formWidth '>
      <BasicFormAreaBG h2Text={headerTxt} >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={desireId} hidden readOnly />

            <div>
              <InputLabelWithGuideLineLink
                inputTitle='Current Situation'
                guideline={DesireCurrentSituationGuideLine}
                guideLineTitle={'Current Situation'}
              />
              <textarea
                className='input-field-text-para '
                placeholder={DesireCurrentSituation}
                name='currentSituation'
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              >
              </textarea>
            </div>


            {/* //**************BUTTONS ***************  */}
            <div className='mt-2  '>
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
      </BasicFormAreaBG >
    </div>
  )
}

export default DesiresCurrentForm