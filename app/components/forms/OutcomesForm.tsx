// import { v4 as uuidOutcomes } from "uuid";
import { Form, } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react'

import FormButtons from '../buttons/FormButtons';
import BasicFormAreaBG from "~/components/forms/util/BasicFormAreaBG";
import useGetNavigationState from '../utilities/useNavigationState';
import { headerText, useSaveBtnText } from './util/FormsCommonFunctions';
import InputLabelWithGuideLineLink from '~/components/forms/inputs/InputLabelWithGuideLineLink';
import { OutcomeDescriptionDefaultText, OutcomeVisionDefaultText } from '~/components/utilities/PlaceHolderTexts';
import { DesireOutcomeGuideline, ProperDesireOutcomeVision, ProperDesireOutcomes } from "~/components/utilities/Guidelines";

import type { Outcome } from '@prisma/client';

interface OutcomeFormProps {
  passedDesireId?: string;
  outcome?: Outcome;
  isNew?: boolean
  nextSortOrder?: number
}

function OutcomesForm({ passedDesireId, outcome, isNew = true, nextSortOrder }: OutcomeFormProps) {

  const [title, setTitle] = useState<string>('')
  const [vision, setVision] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0)  
  const [outcomeId, setOutcomeId] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false)  


  const { isIdle } = useGetNavigationState()
  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Outcome')
  const headerTxt = useMemo(() => headerText(isNew, 'Outcome', outcome?.title || ''), [isNew, outcome?.title])


  useEffect(() => {
    setOutcomeId(outcome?.id || '')
    setTitle(outcome?.title || '')
    setVision(outcome?.vision || '')
    setDescription(outcome?.description || '')
    setSortOrder(nextSortOrder || 0)
  }, [outcome, nextSortOrder])


  useEffect(() => {
    if (!passedDesireId) return
    setDesireId(passedDesireId)
  }, [passedDesireId])


  useEffect(() => {
    const isInputEmpty = !title || !description || !vision
    const isInputDifferent =
      title !== outcome?.title
      || description !== outcome?.description
      || vision !== outcome?.vision
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, isNew, description, vision, outcome?.title, outcome?.description, outcome?.vision]);


  return (
    <>
      <BasicFormAreaBG h2Text={headerTxt}  >

        <Form method='POST' className='p-8 '>
          <div className="form-control gap-y-6 ">
            <input type="string" name='desireId' value={desireId} hidden readOnly />
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='rowId' value={outcomeId} hidden readOnly />

            <div className="form-control gap-6">
              <div>
                <InputLabelWithGuideLineLink
                  inputTitle='Outcome'
                  guideLineTitle='Outcomes'
                  guideline={DesireOutcomeGuideline}
                />
                <input type="text"
                  placeholder="Enter a List Title"
                  name='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className=" input-field-text-title "
                  required
                />
              </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  inputTitle='Outcome Description'
                  guideLineTitle='Defining Proper Outcomes'
                  guideline={ProperDesireOutcomes} />
                <textarea
                  className='input-field-text-para '
                  placeholder={OutcomeDescriptionDefaultText}
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                >
                </textarea>
              </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  inputTitle='Outcome Vision'
                  guideLineTitle='Defining Proper Outcomes'
                  guideline={ProperDesireOutcomeVision} />
                <textarea
                  className='input-field-text-para '
                  placeholder={OutcomeVisionDefaultText}
                  name='vision'
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  required
                >
                </textarea>
              </div>


              {/* //**************BUTTONS ***************  */}
              <div className='mt-2'>
                <FormButtons
                  saveBtnText={saveBtnTxt}
                  isSaveBtnDisabled={!isSaveable || !isIdle}
                  isNew={isNew}
                  isShowCloseBtn={!isNew}
                />
              </div>
            </div>
          </div>
        </Form>
      </BasicFormAreaBG >
    </>
  )
}

export default OutcomesForm



