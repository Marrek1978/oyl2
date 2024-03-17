import { Link, } from '@remix-run/react'
import { useEffect, useState } from 'react';

import HeadingH1 from '../../headers/HeadingH1';
import { EditIcon } from '../../utilities/icons';
import BtnWithProps from '../../buttons/BtnWithProps';
import { useGetBirthDate,  useGetMaxAge } from '~/routes/dash.clarity';


function TimeLeft() {
  const loadedMaxAge: number = useGetMaxAge()
  const loadedBirthDate: Date = useGetBirthDate()

  const [maxAge, setMaxAge] = useState<number>(75)
  const [birthDate, setBirthDate] = useState<Date>()
  const [deathDate, setDeathDate] = useState<string>('')
  const [birthDateString, setBirthDateString] = useState<string>('1980-01-01')

  const [maxAgeDate, setMaxAgeDate] = useState<Date>()
  const [weeksLeft, setWeeksLeft] = useState<number>(0)
  const [weeksLived, setWeeksLived] = useState<number>(0)
  const [weeksInYearBeforeBirth, setWeeksInYearBeforeBirth] = useState<number>(0)


  useEffect(() => {
    if (!loadedMaxAge) return
    setMaxAge(loadedMaxAge)
  }, [loadedMaxAge])

  useEffect(() => {
    if (!loadedBirthDate) return
    setBirthDate(loadedBirthDate)
  }, [loadedBirthDate])


  useEffect(() => {
    if (!birthDate || !maxAge) return
    
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    setBirthDateString(new Intl.DateTimeFormat('en-US', options).format(birthDate))
    setDeathDate(new Date(birthDate.getFullYear() + maxAge, birthDate.getMonth(), birthDate.getDate()).toDateString())
    setWeeksLived(Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7)))
    setMaxAgeDate(new Date(birthDate.getFullYear() + maxAge, birthDate.getMonth(), birthDate.getDate()))
    setWeeksInYearBeforeBirth(Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7)))

  }, [birthDate, maxAge])

  useEffect(() => {
    if (!maxAgeDate) return
    const today = new Date()
    setWeeksLeft(Math.floor((maxAgeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7)))
  }, [maxAgeDate])


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