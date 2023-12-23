import { Form } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'

import FormButtons from '../FormButtons'
import { setAsCurrency } from './SavingForm'
import BasicFormAreaBG from '../BasicFormAreaBG'
import { CoreValue } from '~/components/utilities/Guidelines'
import InputLabelWithGuideLineLink from '../InputLabelWithGuideLineLink'
import useGetNavigationState from '~/components/utilities/useNavigationState'
import { useGetMonthlySavingsAmount } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings'


type Props = {
  CqId: string;
}

function MonthlyAmtForm({ CqId }: Props) {

  const loadedMonthlyAmount = useGetMonthlySavingsAmount()
  const [amtMonthly, setAmtMonthly] = useState<string>('0')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()

  useEffect(() => {
    setAmtMonthly(setAsCurrency(loadedMonthlyAmount.toString()))
  }, [loadedMonthlyAmount])


  //*****************  INPUT HANDLERS  *****************//
  const blurAmtMonthly = useCallback(() => {
    return setAmtMonthly(setAsCurrency(amtMonthly))
  }, [amtMonthly]);
  const handleAmtMonthlyChange = (e: any) => { setAmtMonthly(removeCharacters(e.target.value)) }
  const removeCharacters = (inputValue: any): any => { return inputValue.replace(/[^0-9.]/g, '') };


  useEffect(() => {
    const isInputEmpty = !amtMonthly
    const isInputDifferent = setAsCurrency(amtMonthly) !== setAsCurrency(loadedMonthlyAmount.toString())
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [amtMonthly, loadedMonthlyAmount, blurAmtMonthly]);


  return (
    <BasicFormAreaBG h2Text={"Average Monthly Contribution to Desires"}  >
      <Form method='post' className='p-8'>
        <input type="string" name='rowId' value={CqId} hidden readOnly />
        <div className="form-control gap-y-6">

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
          <FormButtons isSaveBtnDisabled={!isSaveable || !isIdle} />
        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default MonthlyAmtForm