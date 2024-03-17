import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

import PageTitle from '../../headers/PageTitle'
import HeadingH1 from '../../headers/HeadingH1'
import H1WithLink from '../../headers/H1WithLink'
import BtnWithProps from '../../buttons/BtnWithProps'
import TextProseWidth from '../../text/TextProseWidth'
import SubHeading16px from '../../headers/SubHeading16px'
import { setAsCurrency } from '../../forms/savings/SavingForm'
import { useGetMonthlySavingsAmount, useGetTotalPayments } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings_.$savingId'

import type { Payments } from '@prisma/client'
import type { SavingsAndPayments } from '~/types/savingsType'
import { currStringToNum } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings'


interface Props {
  passedSaving: SavingsAndPayments
  path: string
}


function SavingDisplay({ passedSaving, path }: Props) {

  const totalPayments = useGetTotalPayments(path)
  const [estMonths, setEstMonths] = useState<number>(0)
  const [currencyReqd, setCurrencyReqd] = useState<string>('0')
  const [currencySaved, setCurrencySaved] = useState<string>('0')
  const [isPaidInFull, setIsPaidInFull] = useState<boolean>(false)
  const [payments, setPayments] = useState<Payments[] | undefined>([])

  const monthyContribution = useGetMonthlySavingsAmount(path)

  useEffect(() => {
    setCurrencyReqd(passedSaving?.requiredAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, '') || '0')
    const sortedPayments = passedSaving?.payments?.sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime())
    setPayments(sortedPayments)
  }, [passedSaving])

  useEffect(() => {
    setCurrencySaved(totalPayments?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
  }, [totalPayments])

  useEffect(() => {
    if (!passedSaving?.requiredAmount || !totalPayments || !monthyContribution) return
    setEstMonths(Math.round(((passedSaving?.requiredAmount - totalPayments) / monthyContribution) * 100) / 100)
  }, [passedSaving, totalPayments, monthyContribution])

  useEffect(() => {
    if (!currencyReqd || !currencySaved) return
    const reqdNum = currStringToNum(currencyReqd)
    const savedNum = currStringToNum(currencySaved)
    if (savedNum >= reqdNum) { setIsPaidInFull(true) }
    else { setIsPaidInFull(false) }
  }, [currencyReqd, currencySaved])


  return (
    <>
      <PageTitle text={'Saving'} />
      <div className='  mt-2'>
        <H1WithLink title={passedSaving?.title} linkDestination={"edit"} />

        <TextProseWidth text={passedSaving?.description || ' '} />

        <div className={`mt-6 flex gap-4 items-baseline  ${isPaidInFull && 'text-success'} `}>
          <HeadingH1 H1Title={`${currencySaved} / ${currencyReqd}`} />
          <div className="   text-sm text-left  para-color">
            <span className="font-bold text-base" >
              {estMonths}
            </span> months to achieve @ {setAsCurrency(monthyContribution.toString())} / month.
          </div>
        </div>

        <div className='mt-8'>
          <SubHeading16px text={'Savings/Payments'} daisyUIColor={`success`} />
        </div>

        {payments?.map((payment, index) => {
          return (
            <div key={index} className='grid grid-cols-[70px_200px_100px] gap-x-2 items-center  '>
              <div className='text-right'>${payment.amount}</div>
              <div> <span className="para-color px-2" > on </span> {payment.paymentDate.toDateString()}</div>
              <div className='max-w-max'>
                <Link to={payment.id} >
                  <BtnWithProps btnLabel={'Edit'} btnPurpose={'goto'} fontWidthTW={'bold'} textSizeTW={'sm'} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SavingDisplay