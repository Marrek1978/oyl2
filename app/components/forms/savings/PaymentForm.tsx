import { useEffect, useMemo, useState } from 'react'
import { headerText, useSaveBtnText } from '../util/FormsCommonFunctions'
import useGetNavigationState from '~/components/utilities/useNavigationState'

import FormButtons from '../../buttons/FormButtons'
import BasicFormAreaBG from '../util/BasicFormAreaBG'
import { Form, useFetcher } from '@remix-run/react'
import DatePicker from '~/components/forms/inputs/DatePicker'
import { CoreValue } from '~/components/utilities/Guidelines'
import { removeCharacters, setAsCurrency } from './SavingForm'
// import useFetcherState from '~/components/utilities/useFetcherState'
// import useServerMessages from '~/components/modals/useServerMessages'
import InputLabelWithGuideLineLink from '../inputs/InputLabelWithGuideLineLink'
import { useGetSaving } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId'

import type { Payments } from '@prisma/client'
import useFormSubmittedToastUsingFetcher from '~/components/utilities/useFormSubmittedToastUsingFetcher'
// import useFormSubmittedToastUsingFetcher from '~/components/utilities/useFormSubmittedToastUsingFetcher'


type Props = {
  isNew?: boolean
  passedPayment?: Payments
  passedSavingsId: string
}

function PaymentForm({ isNew = true, passedPayment, passedSavingsId }: Props) {

  const { isIdle } = useGetNavigationState()

  const [id, setId] = useState<string>('')
  const [paymentAmt, setPaymentAmt] = useState<string>('0')
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date())
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const savingAndAllPayments = useGetSaving()
  const savingName = savingAndAllPayments?.title || ' '

  const savingsId = passedSavingsId || ' '
  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Payment')
  const headerTxt = useMemo(() => headerText(isNew, 'Payment', savingName), [isNew, savingName])

  const fetcher = useFetcher();
  useFormSubmittedToastUsingFetcher({ fetcher, redirectTo: '../', message: 'Payment was updated' })


  useEffect(() => {
    setId(passedPayment?.id || ' ')
    setPaymentAmt(setAsCurrency(passedPayment?.amount.toString() || '0'))
    setPaymentDate(passedPayment?.paymentDate || new Date())
  }, [passedPayment])



  useEffect(() => {
    const isInputEmpty = !paymentAmt
    const isInputDifferent =
      paymentAmt !== setAsCurrency(passedPayment?.amount.toString() || '0') ||
      paymentDate !== passedPayment?.paymentDate
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [paymentAmt, passedPayment, paymentDate]);


  const handleSave = async () => {

    const strippedPaymentAmt = removeCharacters(paymentAmt).toString()

    const paymentObject = {
      savingsId: savingsId,
      paymentDate: paymentDate,
      amount: strippedPaymentAmt
    }

    const paymentString = JSON.stringify(paymentObject)

    try {
      fetcher.submit({
        paymentString,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearFormStates()
  }

  const handleEdits = async () => {

    const strippedPaymentAmt = removeCharacters(paymentAmt).toString()

    const paymentObject = {
      paymentId: id,
      paymentDate: paymentDate,
      amount: strippedPaymentAmt
    }
    const paymentString = JSON.stringify(paymentObject)

    try {
      fetcher.submit({
        paymentString,
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
    clearFormStates()
  }


  const clearFormStates = () => {
    setId(' ')
    setPaymentAmt(setAsCurrency(passedPayment?.amount.toString() || '0'))
    setPaymentDate(passedPayment?.paymentDate || new Date())
  }


  //*****************  INPUT HANDLERS  *****************//

  const handlePaymentChange = (e: any) => {
    setPaymentAmt(removeCharacters(e.target.value))
  }

  const blurPayment = () => {
    return setPaymentAmt(setAsCurrency(paymentAmt))
  }

  return (
    <>
      <BasicFormAreaBG h2Text={headerTxt}  >

        <Form method='post' className='p-8 '>
          <div className="form-control gap-y-6    ">
            <input type="string" name='savingsId' value={savingsId} hidden readOnly />
            <input type="string" name='rowId' value={id} hidden readOnly />

            <div >
              <InputLabelWithGuideLineLink
                inputTitle='Payment'
                guideline={CoreValue}
                guideLineTitle='Group'
              />
              <input type="text"
                placeholder="Enter the Amount alread Saved"
                name='amtSaved'
                className=" input-field-currency "
                value={paymentAmt}
                onChange={handlePaymentChange}
                onBlur={blurPayment}
                required
              />
            </div>

            <div className='' >
              <DatePicker
                labelText={'Payment Date'}
                selectedDate={paymentDate}
                setSelectedDate={setPaymentDate}
                isHorizontal={false}
              />
            </div>


            {/* //**************BUTTONS ***************  */}

            <div className='mt-2 '>
              <FormButtons
                saveBtnText={saveBtnTxt}
                isSaveBtnDisabled={!isSaveable || !isIdle}
                isNew={isNew}
                isShowCloseBtn={!isNew}
                saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
                saveBtnType='button'
              />
            </div>

          </div>
        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default PaymentForm