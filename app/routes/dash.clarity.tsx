import { Outlet, useRouteLoaderData } from '@remix-run/react'
import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import { getClarifyingQuestions, upsertMaxAge } from '~/models/clarifying.server';
import TimeLeft from '~/components/clarifyingQuestions/TimeLeft';
import ClarifyingQuestionsDisplay from '~/components/clarifyingQuestions/ClarifyingQuestionsDisplay';

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import { useEffect, useState } from 'react';
import { ArrayOfObjectsStrToDates } from '~/components/utilities/helperFunctions';
import type { ClarifyingQuestions } from '@prisma/client';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request);
  try {
    let clarifyingAnswers = await getClarifyingQuestions(userId);
    return clarifyingAnswers
  } catch (error) { throw error }
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const maxAgeString = formData.get('maxAge');
  //validation
  let maxAgeError;
  if (!maxAgeString) {
    maxAgeError = 'Please enter a number between 1 and 150'
    return maxAgeError
  }
  const maxAge = parseInt(maxAgeString as string) | 75

  try {
    await upsertMaxAge(maxAge, userId)
    return redirect('/dash/clarity')
  } catch (error) { throw error }
}


function ClarityPage() {

  return (
    <>
      <Outlet />
      <section className=' flex gap-8 '>
        <div className='flex-1'>
          <BasicTextAreaBG >
            <ClarifyingQuestionsDisplay   />
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

export function useGetClarityLoaderData(path: string = 'routes/dash.clarity') {
  const loaderData = useRouteLoaderData(path)
  const [answers, setAnswers] = useState<ClarifyingQuestions[] >([])

  useEffect(() => {
    if (loaderData === undefined || !loaderData) return
    const clarityArray = loaderData as ClarifyingQuestionsWithStringDates[]
    const clarityArrayWithProperDates = ArrayOfObjectsStrToDates({ items: clarityArray, dateKeys: ['birthDate', 'maxAgeDate', 'createdAt', 'updatedAt'] })
    setAnswers(clarityArrayWithProperDates as ClarifyingQuestions[])
  }, [loaderData])

  return answers
}