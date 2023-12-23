import { useEffect, useState } from 'react'

import PageTitle from '../titles/PageTitle'
import HeadingH1 from '../titles/HeadingH1'
import H1WithLink from '../titles/H1WithLink'
import BtnWithProps from '../buttons/BtnWithProps'
import TextProseWidth from '../text/TextProseWidth'
import SubHeading16px from '../titles/SubHeading16px'
import { setAsCurrency } from '../forms/savings/SavingForm'
import { useGetMonthlySavingsAmount, useGetTotalPayments } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId'

import type { SavingsAndPayments } from '~/types/savingsType'


interface Props {
  passedSaving: SavingsAndPayments
  path: string
}


function SavingDisplay({ passedSaving, path }: Props) {

  const totalPayments = useGetTotalPayments(path)
  const [currencyReqd, setCurrencyReqd] = useState<string>()
  const [currencySaved, setCurrencySaved] = useState<string>('0')
  const [estMonths, setEstMonths] = useState<number>(0)
  const monthyContribution = useGetMonthlySavingsAmount(path)

  useEffect(() => {
    setCurrencyReqd(passedSaving?.requiredAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
  }, [passedSaving])

  useEffect(() => {
    setCurrencySaved(totalPayments?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
  }, [totalPayments])

  useEffect(() => {
    if (!passedSaving?.requiredAmount || !totalPayments || !monthyContribution) return
    setEstMonths(Math.round(((passedSaving?.requiredAmount - totalPayments) / monthyContribution) * 100) / 100)
  }, [passedSaving, totalPayments, monthyContribution])


  // edit saving modal  delete too
  //edit payment modal  delete too
  //add payment form 

  return (
    <>
      <PageTitle text={'Saving'} />
      <div className='  mt-2'>
        <H1WithLink title={passedSaving?.title} linkDestination={"edit"} />

        <TextProseWidth text={passedSaving?.description || ' '} />

        <div className='mt-6 flex gap-4 items-baseline '>
          <HeadingH1 H1Title={`${currencySaved} / ${currencyReqd}`} />
          <div className="   text-sm text-left  para-color">
            <span className="font-bold text-base" >
              {estMonths}
            </span> months to achieve @ {setAsCurrency(monthyContribution.toString())} / month.
          </div>
        </div>

        <div className='mt-8'>
          <SubHeading16px text={'Savings/Payments'} />
        </div>

        {passedSaving?.payments?.map((payment, index) => {
          return (
            <div key={index} className='grid grid-cols-[70px_200px_100px] items-center  '>
              <div>${payment.amount}</div>
              <div> <span className="para-color" >on</span> {payment.paymentDate.toDateString()}</div>
              <div className='max-w-max'>
                <BtnWithProps btnLabel={'Edit'} btnPurpose={'goto'} fontWidthTW={'bold'} textSizeTW={'sm'} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SavingDisplay