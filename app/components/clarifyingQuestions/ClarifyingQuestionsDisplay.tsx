import { Link, Outlet } from '@remix-run/react'

import TextBtn from '~/components/buttons/TextBtn'
import { EditIcon } from '~/components/utilities/icons'

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes'
import HeadingH1 from '../titles/HeadingH1'
import { keysInOrder, timeSpansObj } from './consts'

interface ClarifyingQuestionsDisplayProps {
  questions: ClarifyingQuestionsWithStringDates[]
}


function ClarifyingQuestionsDisplay({questions}: ClarifyingQuestionsDisplayProps) {

  
  return (
    <>
      <Outlet />
      <HeadingH1 H1Title='Clarifying Questions' />
      <div className='mt-8 font-mont max-w-max'>
        <div className='text-xl font-semibold mt-8' >
          How would I spend my time if I only had...
        </div>
        {keysInOrder.map((key:string, index) => {
          if (key === 'twentyFourHours' || key === 'oneWeek' || key === 'oneMonth' || key === 'oneYear') {
            return (
              <div key={index} >
                <div className='flex justify-between mt-16 items-baseline' >
                  <div className=''>
                    <div className='text-xl font-semibold '> {timeSpansObj[key]}</div>
                    <div className='text-sm font-medium'> {new Date(new Date().setDate(new Date().getDate() + Number(timeSpansObj[key + 'Days']))).toDateString()}</div>
                  </div>
                  <Link to={key} >
                    <TextBtn
                      text='Edit'
                      onClickFunction={() => { }}
                      icon={EditIcon}
                      textColorDaisyUI='primary'
                    />
                  </Link>
                </div>

                <div className='text-base-content mt-1  max-w-prose'>
                  {questions && questions[0] ? questions[0][key as keyof ClarifyingQuestionsWithStringDates] : ''}
                </div>

                <div className='text-md font-semibold mt-6'>
                  What regrets would I have?
                </div>
                <div className='text-base-content mt-1  max-w-prose'>
                  {questions && questions[0] ? questions[0][(key + 'Regrets'  as keyof ClarifyingQuestionsWithStringDates)] : ''}
                </div>
              </div >
            )
          } else if (key === 'fiveYears' || key === 'twentyYears' || key === 'fiftyYears') {
            return (
              <div key={index} >
                <div className='flex justify-between mt-12 ' >
                  <div className=' '>
                    <div className='text-lg font-semibold '> {timeSpansObj[key]}</div>
                    <div className='text-sm font-medium'> {new Date(new Date().setDate(new Date().getDate() + Number(timeSpansObj[key + 'Days']))).getFullYear()}</div>
                  </div>
                  <Link to={key} >
                    <TextBtn
                      text='Edit'
                      onClickFunction={() => { }}
                      icon={EditIcon}
                      textColorDaisyUI='primary'
                    />
                  </Link>
                </div>
                <div className='text-base-content mt-4  max-w-prose'>
                  {questions && questions[0] ? questions[0][key] : ''}
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