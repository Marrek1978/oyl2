import { useEffect, useState } from 'react';
import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import TimeLeft from '~/components/displays/clarifyingQuestions/TimeLeft';
import { getClarifyingQuestions } from '~/models/clarifying.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';
import ClarifyingQuestionsDisplay from '~/components/displays/clarifyingQuestions/ClarifyingQuestionsDisplay';

import type { ClarifyingQuestions } from '@prisma/client';
import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    let clarifyingAnswers = await getClarifyingQuestions(userId);
    return clarifyingAnswers
  } catch (error) { throw error }
};



function ClarityPage() {

  return (
    <>
      <Outlet />
      <section className=' flex gap-8 '>
        <div className='flex-1'>
          <BasicTextAreaBG >
            <ClarifyingQuestionsDisplay />
          </BasicTextAreaBG >
        </div>

        <div className='flex-1 '>
          <BasicTextAreaBG >
            <TimeLeft />
          </BasicTextAreaBG >
        </div>
      </section >
    </>
  )
}

export default ClarityPage

export function useGetClarityLoaderData(path: string = 'routes/dash.clarity'): ClarifyingQuestions[] | undefined {
  const loaderData = useRouteLoaderData(path)
  const [answers, setAnswers] = useState<ClarifyingQuestions[]>([])

  useEffect(() => {
    if (loaderData === undefined || !loaderData) return
    const clarityArray = loaderData as ClarifyingQuestionsWithStringDates[]
    const clarityArrayWithProperDates = ArrayOfObjectsStrToDates({ items: clarityArray, dateKeys: ['birthDate', 'maxAgeDate', 'createdAt', 'updatedAt'] })
    setAnswers(clarityArrayWithProperDates as ClarifyingQuestions[])
  }, [loaderData])

  return answers
}

export function useGetMaxAge():number {
  const loadedAnswers = useGetClarityLoaderData() as ClarifyingQuestions[]
  const [maxAge, setMaxAge] = useState<number>(75)

  useEffect(() => {
    if (!loadedAnswers) return
    const answers = loadedAnswers[0] as ClarifyingQuestions
    if (!answers?.maxAge) return
    setMaxAge(answers.maxAge)
  }, [loadedAnswers])

  return maxAge
}



export function useGetBirthDate():Date {
  const loadedAnswers = useGetClarityLoaderData() as ClarifyingQuestions[]
  const [birthDate, setBirthDate] = useState<Date>(new Date('1980-01-01'))

  useEffect(() => {
    if (!loadedAnswers) return
    const answers = loadedAnswers[0] as ClarifyingQuestions
    if (!answers?.birthDate) return

    setBirthDate(answers.birthDate)
  }, [loadedAnswers])

  return birthDate
}