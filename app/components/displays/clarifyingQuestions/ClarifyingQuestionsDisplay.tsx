import { Link, Outlet } from '@remix-run/react'

import HeadingH1 from '~/components/headers/HeadingH1'
import BtnWithProps from '~/components/buttons/BtnWithProps'
import { useGetClarityLoaderData } from '~/routes/dash.clarity'
import { keysInOrder, timeSpansObj } from '~/components/displays/clarifyingQuestions/consts'

import type { ClarifyingQuestions } from '@prisma/client'



function ClarifyingQuestionsDisplay() {

  const answers = useGetClarityLoaderData() as ClarifyingQuestions[]
  return (
    <>
      <Outlet />
      <div className='text-base-content'>
        <HeadingH1 H1Title='Clarifying Questions' />
        <div className='mt-8 font-mont max-w-max'>
          <div className='text-xl font-semibold mt-8' >
            How would I spend my time if I only had...
          </div>
          {keysInOrder.map((key: string, index) => {
            if (key === 'twentyFourHours' || key === 'oneWeek' || key === 'oneMonth' || key === 'oneYear' || key === 'fiveYears' || key === 'twentyYears' || key === 'fiftyYears') {
              return (
                <div key={index} >
                  <div className='flex justify-between mt-16 items-baseline' >
                    <div className=' flex flex-wrap gap-x-2 items-baseline '>
                      <div className='text-xl font-semibold '> {timeSpansObj[key]}</div>
                      <div className='text-sm font-medium'> {new Date(new Date().setDate(new Date().getDate() + Number(timeSpansObj[key + 'Days']))).toDateString()}</div>
                    </div>
                    <Link to={key} >
                      <BtnWithProps
                        btnPurpose={'goto'}
                        btnLabel={'Edit'}
                        textColorDaisyUI={'primary'}
                        onClickFunction={() => { }}
                        textSizeTW={'sm'}
                        fontWidthTW={'bold'}
                      />
                    </Link>
                  </div>

                  <div className='text-base-content mt-1  max-w-prose'>
                    {answers && answers[0] ? answers[0][key] : ''}
                  </div>

                  {(key === 'twentyFourHours' || key === 'oneWeek' || key === 'oneMonth' || key === 'oneYear') && (
                    <>
                      <div className='text-md font-semibold mt-6'>
                        What regrets would I have?
                      </div>
                      <div className='text-base-content mt-1  max-w-prose'>
                        {answers && answers[0] ? answers[0][(key + 'Regrets' as keyof ClarifyingQuestions)] as string | undefined : ''}
                      </div>
                    </>
                  )}
                </div >
              )
            } else {
              return null
            }
          })}
        </div >
      </div >
    </>
  )
}

export default ClarifyingQuestionsDisplay