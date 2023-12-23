import { useState, useEffect, useMemo, } from 'react';
import { Form, useFetcher, useParams, } from '@remix-run/react'

import FormButtons from '../FormButtons';
// import DatePicker from '~/components/list/DatePicker';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, useSaveBtnText } from '../FormsCommonFunctions';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines';
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';

import type { Savings } from '@prisma/client';


type Props = {
  passedSaving?: Savings
  isNew?: boolean
  savingsArrayLength?: number
}

function SavingForm({ passedSaving, isNew = true, savingsArrayLength = 0 }: Props) {
  const params = useParams();
  // const fetcher = useFetcher();

  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [amtReqd, setAmtReqd] = useState<string>('0')
  const [amtSaved, setAmtSaved] = useState<string>('0')
  const [amtMonthly, setAmtMonthly] = useState<string>('0')

  const { isIdle } = useGetNavigationState()

  const paramsOutcomeId = useMemo(() => params.outcomeId, [params.outcomeId])
  if (!paramsOutcomeId) throw new Error('Outcome Id is missing')
  const saving = useMemo(() => passedSaving, [passedSaving])

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Saving')
  const headerTxt = useMemo(() => headerText(isNew, 'Saving', saving?.title || ''), [isNew, saving?.title])


  useEffect(() => {
    setId(saving?.id || '')
    setTitle(saving?.title || '')
    setDescription(saving?.description || '')
    setStartDate(saving?.startDate || null)
    setSortOrder(saving?.sortOrder || savingsArrayLength || 0)
  }, [saving, savingsArrayLength])


  useEffect(() => {
    const isInputEmpty = !title
    const isInputDifferent =
      title !== saving?.title
      || description !== saving?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, saving]);



  const removeCharacters = (inputValue: any): any => {
    return inputValue.replace(/[^0-9.]/g, '');
  };




  //*****************  INPUT HANDLERS  *****************//

  //? *****************  AMOUNT REQUIRED *****************//
  const handleAmtReqdChange = (e: any) => {
    setAmtReqd(removeCharacters(e.target.value))
  }

  const blurAmtReqd = () => {
    return setAmtReqd(setAsCurrency(amtReqd))
  }

  //? *****************  AMOUNT SAVED *****************//
  const handleAmtSavedChange = (e: any) => {
    setAmtSaved(removeCharacters(e.target.value))
  }

  const blurAmtSaved = () => {
    return setAmtSaved(setAsCurrency(amtSaved))
  }


  //? *****************  AMOUNT Monthly *****************//
  const handleAmtMonthlyChange = (e: any) => {
    setAmtMonthly(removeCharacters(e.target.value))
  }

  const blurAmtMonthly = () => {
    return setAmtMonthly(setAsCurrency(amtMonthly))
  }




  return (
    <BasicFormAreaBG h2Text={headerTxt}  >

      <Form method='post' className='p-8 '>
        <div className="form-control gap-y-6    ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='rowId' value={id} hidden readOnly />
          <input type="string" name='outcomeId' value={paramsOutcomeId} hidden readOnly />

          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Saving Title'
              guideline={CoreValue}
              guideLineTitle='Group'
            />
            <input type="text"
              placeholder="Enter a Savings Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div  >
            <InputLabelWithGuideLineLink
              inputTitle='Saving Description (Optional)'
              guideline={CoreValueStatement}
              guideLineTitle='Milestone Group Description'
            />
            <textarea
              className="input-field-text-para   "
              placeholder={MilestoneGroupDefaultText}
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
          </div>

          {/* <div  className='' >
            <DatePicker
              labelText={'Start Date'}
              selectedDate={startDate}
              setSelectedDate={setStartDate}
              isHorizontal={false}
            />
          </div> */}

          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Total Amount Required'
              guideline={CoreValue}
              guideLineTitle='Group'
            />
            <input type="text"
              placeholder="Enter the Total Amount Required"
              name='amtRequired'
              className=" input-field-currency "
              value={amtReqd}
              onChange={handleAmtReqdChange}
              onBlur={blurAmtReqd}
              required
            />
          </div>

          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Already Saved'
              guideline={CoreValue}
              guideLineTitle='Group'
            />
            <input type="text"
              placeholder="Enter the Amount alread Saved"
              name='amtSaved'
              className=" input-field-currency "
              value={amtSaved}
              onChange={handleAmtSavedChange}
              onBlur={blurAmtSaved}
              required
            />
          </div>


          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Avg Monthly Contribution'
              guideline={CoreValue}
              guideLineTitle='Group'
            />
            <input type="text"
              placeholder="Enter the Amount to Contribute each month"
              name='amtMonthly'
              className=" input-field-currency "
              value={amtMonthly}
              onChange={handleAmtMonthlyChange}
              onBlur={blurAmtMonthly}
              required
            />
          </div>



          {/* //**************BUTTONS ***************  */}

          <div className='mt-2 '>
            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable || !isIdle}
              isNew={isNew}
              isShowCloseBtn={!isNew}
              // saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
              saveBtnType='submit'
            />
          </div>

        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default SavingForm


export const setAsCurrency = (value: string) => {
  const currencyRegex = /^\$\d+(,\d{3})*(\.\d{2})?$/;
  if (currencyRegex.test(value)) return value;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseInt(value))
}