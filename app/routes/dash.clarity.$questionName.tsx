import { useParams } from '@remix-run/react';
import { type ActionFunctionArgs, redirect } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal';
import { requireUserId } from '~/models/session.server';
import { useGetClarityLoaderData } from './dash.clarity';
import { upsertClarifyingQuestions } from '~/models/clarifying.server';
import ClarityQuestionsEditModal, { type QuestionNameTypes } from '~/components/modals/ClarityQuestionsEditModal';

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const clarityData = Object.fromEntries(formData);
  let reshapedData: Record<string, any> = {};
  let validationErrors: Record<string, string> = {};

  for (const [key, value] of Object.entries(clarityData)) {
    if (key === 'birthDate') {
      reshapedData[key] = new Date(value as string)
      if (!(reshapedData[key] instanceof Date)) {
        return validationErrors[key] = 'Please enter a valid date'
      }
    } else if (key === 'maxAge') {
      reshapedData[key] = parseInt(value as string)
    } else if (key === 'fiveYears' || key === 'twentyYears' || key === 'fiftyYears') {
      reshapedData[key] = value as string
    } else {
      reshapedData[key] = value as string
    }
  }

  try {
    await upsertClarifyingQuestions(reshapedData, userId)
    return redirect('/dash/clarity')
  } catch (error) { throw error }
}

function EditClarityQuestionsPage() {
  const params = useParams()
  const questionName = params.questionName as QuestionNameTypes
  const questions = useGetClarityLoaderData() as ClarifyingQuestionsWithStringDates[]

  return (
    <>
      {questionName && (
        <Modal onClose={() => { }} zIndex={20}>
          <ClarityQuestionsEditModal
            questionName={questionName}
            questions={questions}
          />
        </Modal>
      )}
    </>
  )
}

export default EditClarityQuestionsPage