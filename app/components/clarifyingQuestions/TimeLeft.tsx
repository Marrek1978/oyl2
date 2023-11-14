import { Form, Link, useActionData, useMatches } from '@remix-run/react'

import TextBtn from '../buttons/TextBtn';
import HeadingH1 from '../titles/HeadingH1';
import { EditIcon } from '../utilities/icons';

import type { ClarifyingQuestions } from '@prisma/client';

function TimeLeft() {

  // const matches = useMatches();
  // const maxAgeError:string | undefined  = useActionData()
  // const questions: ClarifyingQuestions[] = matches.find(match => match.id === 'routes/dash.clarity')?.data as ClarifyingQuestions[]
  // const retrievedMaxAge = questions?.maxAge !== null ? questions[0].maxAge : 65

  // const bDay = new Date(questions[0]?.birthDate ?? '1980-01-01' as string)
  // const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  // const birthDate = new Intl.DateTimeFormat('en-US', options).format(bDay);

  // const today = new Date()
  // const weeksLived = Math.floor((today.getTime() - bDay.getTime()) / (1000 * 60 * 60 * 24 * 7))
  // const maxAgeDate = new Date(bDay.getFullYear() + retrievedMaxAge, bDay.getMonth(), bDay.getDate());
  // const weeksLeft = Math.floor((maxAgeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  // const weeksInYearBeforeBirth = Math.floor((bDay.getTime() - new Date(bDay.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))

  return (
    <>
      <HeadingH1 H1Title='Life Calendar' />
      <div className='text-md flex mt-8  gap-12'>
        <div>
          {/* Birthday: <span className='font-medium'> &nbsp; {birthDate}</span> */}
        </div>
        <Link to={'birthDate'} >
          <TextBtn
            text='Edit'
            onClickFunction={() => { }}
            icon={EditIcon}
            textColorDaisyUI='primary'
          />
        </Link>
      </div>

      <Form method='post' className='mt-4 '>
        <div className='flex gap-4 items-baseline'>
          <label className="label">
            <span className="label-text text-base font-mont font-medium">Maximum Age</span>
          </label>
          {/* <input
            type="number"
            className="
              w-20
              input border-none input-secondary 
              bg-base-200 rounded-none
              font-poppins font-normal  leading-snug"
            name='maxAge'
            min={1}
            max={150}
            defaultValue={retrievedMaxAge || 85}
          > */}
          {/* </input> */}
          <button
            type='submit'
            className='btn btn-primary btn-sm  rounded-none 0 '
          >
            Save
          </button>
        </div>
        {/* {maxAgeError && (
          <div className='text-red-700'> {maxAgeError}</div>
        )} */}
      </Form>

      <div className='mt-6'>
        {/* <div>You have lived {weeksLived} weeks</div>
        <div>You have {weeksLeft} weeks left until you reach {retrievedMaxAge} years</div> */}
      </div>

      {/* <div className='mt-8'>{birthDate}</div> */}
      {/* <div className='mt-1 flex flex-wrap gap-2 '>
        {Array.from(Array(retrievedMaxAge).keys()).map((year) => {
          return (
            <div className='grid grid-cols-4 grid-flow-row gap-1' key={year}>
              {
                Array.from(Array(Math.min(52, 100)).keys()).map((week) => {
                  //weeks before birth
                  if (year === 0 && week < weeksInYearBeforeBirth) return <div className='w-2 h-2 bg-gray-200' key={week}></div>
                  //first 18 years
                  if (year < 18) return <div className='w-2 h-2 bg-red-200' key={week}></div>
                  if (year < 19 && week < weeksInYearBeforeBirth) return <div className='w-2 h-2 bg-red-200' key={week}></div>
                  if (Math.floor(weeksLived / 52) > year) return <div className='w-2 h-2 bg-lime-500' key={week}></div>
                  /// last year
                  if (Math.floor(weeksLived / 52) === year && week < weeksLived % 52) return <div className='w-2 h-2 bg-lime-500' key={week}></div>
                  return <div className='w-2 h-2 bg-gray-200' key={week}></div>
                })
              }
            </div>
          )
        })}
        <div className='mt-1'>{retrievedMaxAge} Years Old</div>
      </div> */}
    </>
  )
}

export default TimeLeft