import { Outlet, useLoaderData } from '@remix-run/react'
import { redirect, type LoaderArgs, type ActionArgs } from '@remix-run/server-runtime';

import { requireUserId } from '~/models/session.server';
import {
  getClarifyingQuestions, upsertMaxAge,
  //  upsertClarifyingQuestions
} from '~/models/clarifying.server';
import TimeLeft from '~/components/clarifyingQuestions/TimeLeft';
import ClarifyingQuestionsDisplay from '~/components/clarifyingQuestions/ClarifyingQuestionsDisplay';

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';

export const loader = async ({ request }: LoaderArgs) => {

  let userId;
  try {
    userId = await requireUserId(request);
  } catch (error) { throw error }

  try {
    let questions = await getClarifyingQuestions(userId);
    return questions
  } catch (error) { throw error }
};


export const action = async ({ request }: ActionArgs) => {

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

  const questions = useLoaderData<ClarifyingQuestionsWithStringDates[]>();

  return (
    <>
      <Outlet />
      <section className=' flex gap-8 '>
        <div className='flex-1'>
          <BasicTextAreaBG >
            <ClarifyingQuestionsDisplay questions={questions} />
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