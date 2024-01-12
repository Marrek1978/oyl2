import type { SavingsAndPaymentsWithStrDates } from '~/types/savingsType'
import { addDeciamlMonthsToDate } from '../dnds/savings/DndSavings';

type Props = {
  savings: SavingsAndPaymentsWithStrDates[];
  monthlyAmount: number | null | undefined;
}

function SavingsBadges({ savings, monthlyAmount }: Props) {

  let monthlySavingsAmount = 1
  monthlyAmount && (monthlySavingsAmount = monthlyAmount)

  const today = new Date()
  let runningDate = today

  return (
    <>
      <div className='flex flex-wrap gap-x-12 gap-y-6 mt-4'>
        {savings && savings.map((saving, index) => {

          let savedAmount: number = 0
          saving.payments.forEach(payment => {
            savedAmount += payment.amount
          })

          if (saving?.requiredAmount && saving?.requiredAmount > savedAmount) {
            const monthsLeft = (saving?.requiredAmount || 0 - savedAmount) / monthlySavingsAmount
            runningDate = addDeciamlMonthsToDate(runningDate, monthsLeft)
          }

          return (
            <div key={index}>
              <div className='text-base-content/70 font-bold text-xl uppercase font-mont'>
                {saving.title}
              </div>

              <div className='text-base-content/90  font-semibold text-3xl uppercase font-roboto'>
                {savedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, '')} / {saving?.requiredAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, '')}
              </div>

              <div className='text-right text-sm'>
                Est.: <span className="font-bold " > {runningDate.toDateString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default SavingsBadges