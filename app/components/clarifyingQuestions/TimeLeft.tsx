import { useEffect, useState } from 'react';
import { Link, } from '@remix-run/react'

import HeadingH1 from '../titles/HeadingH1';
import { EditIcon } from '../utilities/icons';

import { useGetClarityLoaderData } from '~/routes/dash.clarity';

import type { ClarifyingQuestions } from '@prisma/client';
import BtnWithProps from '../buttons/BtnWithProps';

function TimeLeft() {

  const [answers, setAnswers] = useState<ClarifyingQuestions>()
  const loadedClarityAnswers = useGetClarityLoaderData() as ClarifyingQuestions[]

  const [maxAge, setMaxAge] = useState<number>(75)
  const [deathDate, setDeathDate] = useState<string>('')
  const [birthDate, setBirthDate] = useState<Date>(new Date('1980-01-01'))
  const [birthDateString, setBirthDateString] = useState<string>('1980-01-01')

  const today = new Date()
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
  const maxAgeDate = new Date(birthDate.getFullYear() + maxAge, birthDate.getMonth(), birthDate.getDate());
  const weeksLeft = Math.floor((maxAgeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksInYearBeforeBirth = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))


  useEffect(() => {
    if (loadedClarityAnswers === undefined || loadedClarityAnswers === null || !loadedClarityAnswers[0]) return
    setAnswers(loadedClarityAnswers[0])
  }, [loadedClarityAnswers])


  useEffect(() => {
    if (answers === undefined) return
    if (answers.maxAge !== null) {
      setMaxAge(answers.maxAge)
      if (answers.birthDate !== null) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
        setBirthDate(answers.birthDate)
        setBirthDateString(new Intl.DateTimeFormat('en-US', options).format(answers.birthDate))
        setDeathDate(new Date(answers.birthDate.getFullYear() + answers.maxAge, answers.birthDate.getMonth(), answers.birthDate.getDate()).toDateString())
      }
    }
  }, [answers])



  return (
    <>
      <HeadingH1 H1Title='Life Calendar' />
      <div className='text-md flex mt-8  gap-12'>
        <div>
          Birthday: <span className='font-medium'> &nbsp; {birthDateString}</span>
        </div>
        <Link to={'birthDate'} >
          <BtnWithProps
            btnPurpose='goto'
            btnLabel='Edit'
            textColorDaisyUI='primary'
            icon={EditIcon}
            fontWidthTW='bold'
          />
        </Link>
      </div>

      <div className='text-md flex mt-4  gap-12'>
        <div>
          Maximum Age: <span className='font-medium'> &nbsp; {maxAge} years old</span>
        </div>
        <Link to={'maxAge'} >
          <BtnWithProps
            btnPurpose='goto'
            btnLabel='Edit'
            textColorDaisyUI='primary'
            icon={EditIcon}
            fontWidthTW='bold'
          />
        </Link>
      </div>

      {/* <Form method='post' className='mt-4 '>
        <div className='flex gap-4 items-baseline'>
          <label className="label">
            <span className="label-text text-base font-mont font-medium">Maximum Age</span>
          </label>
          <input
            type="number"
            className="
              w-20
              input border-none input-secondary 
              bg-base-200 rounded-none
              font-poppins font-normal  leading-snug"
            name='maxAge'
            min={1}
            max={150}
            defaultValue={maxAge || 85}
          >
          </input>
          <button
            type='submit'
            className='btn btn-primary btn-sm  rounded-none 0 '
          >
            Save
          </button>
        </div>
        {maxAgeError && (
          <div className='text-red-700'> {maxAgeError}</div>
        )}
      </Form> */}

      <div className='mt-6'>
        <div>You have <span className='font-medium'> lived {weeksLived}</span> weeks</div>
        <div>You have <span className='font-medium'>{weeksLeft} weeks</span> left until you reach {maxAge} years</div>
      </div>

      <div className='mt-8'>Born: {birthDateString}</div>
      <div className='mt-1 flex flex-wrap gap-2 '>
        {Array.from(Array(maxAge).keys()).map((year) => {
          return (
            <div className='grid grid-cols-4 grid-flow-row gap-1' key={year}>
              {
                Array.from(Array(Math.min(52, 100)).keys()).map((week) => {
                  //weeks before birth
                  if (year === 0 && week < weeksInYearBeforeBirth) return <div className='w-2 h-2 bg-gray-200' key={week}></div>
                  //first 18 years
                  if (year < 18) return <div className='w-2 h-2 bg-red-300' key={week}></div>
                  if (year < 19 && week < weeksInYearBeforeBirth) return <div className='w-2 h-2 bg-red-300' key={week}></div>
                  if (Math.floor(weeksLived / 52) > year) return <div className='w-2 h-2 bg-lime-500' key={week}></div>
                  /// last year
                  if (Math.floor(weeksLived / 52) === year && week < weeksLived % 52) return <div className='w-2 h-2 bg-lime-500' key={week}></div>
                  return <div className='w-2 h-2 bg-gray-200' key={week}></div>
                })
              }
            </div>
          )
        })}
        <div className='flex flex-wrap gap-1'>
          <div className='mt-1'>You will be {maxAge} years old on</div>
          <div className='mt-1'>{deathDate}</div>
        </div>
      </div>
    </>
  )
}

export default TimeLeft