import { useMatches, useParams } from '@remix-run/react';
import { type ActionArgs, redirect } from '@remix-run/server-runtime'

import Modal from '~/components/modals/Modal';
import ClarityQuestionsEditModal from '~/components/modals/ClarityQuestionsEditModal';
import { upsertClarifyingQuestions } from '~/models/clarifying.server';
import { requireUserId } from '~/models/session.server';

export const action = async ({ request }: ActionArgs) => {

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
    } else {
      reshapedData[key] = value
    }
  }

  try {
    await upsertClarifyingQuestions(reshapedData, userId)
    return redirect('/dash/clarity')
  } catch (error) { throw error }
}

function EditClarityQuestionsPage() {

  const params = useParams()
  const questionName = params.questionName
  const matches = useMatches();
  const questions = matches.find(match => match.id === 'routes/dash.clarity')?.data

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