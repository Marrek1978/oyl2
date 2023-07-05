import { Link, Outlet } from '@remix-run/react'

import TextBtn from '~/components/buttons/TextBtn'
import { EditIcon } from '~/components/utilities/icons'

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes'
import HeadingH1 from '../titles/HeadingH1'

interface ClarifyingQuestionsDisplayProps {
  questions: ClarifyingQuestionsWithStringDates[]
}


function ClarifyingQuestionsDisplay({ questions }: ClarifyingQuestionsDisplayProps) {

  const keysInOrder: string[] = [
    'birthDate',
    'twentyFourHours',
    'twentyFourRegrets',
    'oneWeek',
    'oneWeekRegrets',
    'oneMonth',
    'oneMonthRegrets',
    'oneYear',
    'oneYearRegretss',
    'fiveYears',
    'twentyYears',
    'fiftyYears',
  ]

  const textObj: { [key: string]: string | number } = {
    'birthDate': 'Your Birth Day is ',
    'twentyFourHours': '24 Hours to Live ',
    'twentyFourHoursDays': 1,
    'twentyFourHoursRegrets': 'What regrets would I have? ',
    'oneWeek': '1 Week to Live ',
    'oneWeekDays': 7,
    'oneWeekRegrets': 'What regrets would I have? ',
    'oneMonth': '1 Month to Live ',
    'oneMonthDays': 30,
    'oneMonthRegrets': 'What regrets would I have? ',
    'oneYear': '1 Year to Live ',
    'oneYearDays': 365,
    'oneYearRegrets': 'What regrets would I have? ',
    'fiveYears': '5 Years to Live ',
    'fiveYearsDays': 1826,
    'twentyYears': '20 Years to Live: ',
    'twentyYearsDays': 7305,
    'fiftyYears': '50 Years to Live ',
    'fiftyYearsDays': 18262,
  }

  return (
    <>
      <Outlet />
      <HeadingH1 text='Clarifying Questions' />
      <div className='mt-8 font-mont max-w-max'>
        <div className='text-xl font-semibold mt-8' >
          How would I spend my time if I only had...
        </div>
        {keysInOrder.map((key, index) => {
          if (key === 'twentyFourHours' || key === 'oneWeek' || key === 'oneMonth' || key === 'oneYear') {
            return (
              <div key={index} >
                <div className='flex justify-between mt-16 items-baseline' >
                  <div className=''>
                    <div className='text-xl font-semibold '> {textObj[key]}</div>
                    <div className='text-sm font-medium'> {new Date(new Date().setDate(new Date().getDate() + Number(textObj[key + 'Days']))).toDateString()}</div>
                  </div>
                  <Link to={key} >
                    <TextBtn
                      text='Edit'
                      onClickFunction={() => { }}
                      icon={EditIcon}
                      color='primary'
                    />
                  </Link>
                </div>

                <div className='text-base-content mt-1  max-w-prose'>
                  {questions[0][key]}
                </div>

                <div className='text-md font-semibold mt-6'>
                  What regrets would I have?
                </div>
                <div className='text-base-content mt-1  max-w-prose'>
                  {questions[0][(key + 'Regrets') as keyof ClarifyingQuestionsWithStringDates]}
                </div>
              </div >
            )
          } else if (key === 'fiveYears' || key === 'twentyYears' || key === 'fiftyYears') {
            return (
              <div key={index} >
                <div className='flex justify-between mt-12 ' >
                  <div className=' '>
                    <div className='text-lg font-semibold '> {textObj[key]}</div>
                    <div className='text-sm font-medium'> {new Date(new Date().setDate(new Date().getDate() + Number(textObj[key + 'Days']))).getFullYear()}</div>
                  </div>
                  <Link to={key} >
                    <TextBtn
                      text='Edit'
                      onClickFunction={() => { }}
                      icon={EditIcon}
                      color='primary'
                    />
                  </Link>
                </div>
                <div className='text-base-content mt-4  max-w-prose'>
                  {questions[0][key]}
                </div>
              </div>
            )
          } else {
            return null
          }
        })}
      </div >
    </>
  )
}

export default ClarifyingQuestionsDisplay