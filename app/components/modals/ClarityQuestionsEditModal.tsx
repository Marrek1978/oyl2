import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Form, useActionData } from '@remix-run/react'

import FormButtons from '../forms/FormButtons';
import BasicFormAreaBG from '../forms/BasicFormAreaBG';
import TextInputField from '../forms/inputs/TextInputField';
import TextAreaInputField from '../forms/inputs/TextAreaInputField';
import { TimeSpanPlaceHolderTextObj } from '../clarifyingQuestions/consts';

import type { ClarifyingQuestions } from '@prisma/client';

export type QuestionNameTypes =
  'birthDate'
  | 'maxAge'
  | 'twentyFourHours'
  | 'twentyFourHoursRegrets'
  | 'oneWeek'
  | 'oneWeekRegrets'
  | 'oneMonth'
  | 'oneMonthRegrets'
  | 'oneYear'
  | 'oneYearRegrets'
  | 'fiveYears'
  | 'twentyYears'
  | 'fiftyYears'

interface ClarityQuestionsEditModalProps {
  questionName: QuestionNameTypes
  questions: ClarifyingQuestions[]
}

function ClarityQuestionsEditModal({ questionName, questions }: ClarityQuestionsEditModalProps) {
  const validationErrors = useActionData() as string
  let regretsKey = (questionName + "Regrets") as keyof ClarifyingQuestions;

  const [formTitle, setFormTitle] = useState<string>('')
  const [inputType, setInputType] = useState<string>('text')

  const [inputLabel, setInputLabel] = useState<string>('')
  const [inputJSX, setInputJSX] = useState<ReactNode>(null)
  const [inputValue, setInputValue] = useState<string | number | undefined>('')
  const [loadedInputValue, setLoadedInputValue] = useState<string | number | undefined>('')

  const [regretsInputFieldLabel, setRegretsInputFieldLabel] = useState<string>('')
  const [regretsInputFieldJSX, setRegretsInputFieldJSX] = useState<ReactNode>(null)
  const [regretsInputValue, setRegretsInputValue] = useState<string | number | undefined>('')
  const [loadedRegretsValue, setLoadedRegretsValue] = useState<string | number | undefined>()

  const [isSaveable, setIsSaveable] = useState<boolean>(false)


  useEffect(() => {
    if (!loadedInputValue) return
    setInputValue(loadedInputValue)
  }, [loadedInputValue])

  useEffect(() => {
    if (!loadedRegretsValue) return
    setRegretsInputValue(loadedRegretsValue)
  }, [loadedRegretsValue])


  useEffect(() => {
    if (!questions || !questions[0]) return
    setInputLabel(TimeSpanPlaceHolderTextObj[questionName])
    setFormTitle(TimeSpanPlaceHolderTextObj[questionName + `Title`])

    if (questionName === 'birthDate') {
      setLoadedInputValue(formatDate(questions && questions[0] && questions[0][questionName]?.toISOString()))
      setInputType('date')
      setInputJSX(
        <TextInputField
          inputFieldLabel={inputLabel}
          inputType={inputType}
          defaultValue={loadedInputValue}
          fieldName={questionName}
          validationErrors={validationErrors}
          onChangeSetter={setInputValue}
        />
      )
    }

    if (questionName === 'maxAge') {
      setLoadedInputValue(questions && questions[0] && questions[0][questionName] || 76)
      setInputType('number')
      setInputJSX(
        <TextInputField
          inputFieldLabel={inputLabel}
          inputType={inputType}
          defaultValue={loadedInputValue}
          fieldName={questionName}
          validationErrors={validationErrors}
          onChangeSetter={setInputValue}
        />
      )
    }

    if (questionName !== 'birthDate' && questionName !== 'maxAge') {
      setLoadedInputValue((questions && questions[0] && questions[0][questionName])
        ? questions[0][questionName] as string
        : '')
      setInputJSX(
        <TextAreaInputField
          inputFieldLabel={inputLabel}
          fieldName={questionName}
          defaultValue={loadedInputValue}
          placeholder={'I would...'}
          validationErrors={validationErrors}
          onChangeSetter={setInputValue}
        />
      )
    }

    //*********************  REGRET FIELDS ***************** */
    if (questionName === 'twentyFourHours' || questionName === 'oneWeek' || questionName === 'oneMonth' || questionName === 'oneYear') {
      setRegretsInputFieldLabel(TimeSpanPlaceHolderTextObj[regretsKey])
      setLoadedRegretsValue((questions && questions[0] && questions[0][regretsKey])
        ? questions[0][regretsKey] as string
        : '')
      setRegretsInputFieldJSX(
        <TextAreaInputField
          inputFieldLabel={regretsInputFieldLabel}
          fieldName={regretsKey}
          defaultValue={loadedRegretsValue}
          placeholder={'I would regret...'}
          validationErrors={validationErrors}
          onChangeSetter={setRegretsInputValue}
        />
      )
    }
  }, [questions, questionName, regretsKey, inputLabel, inputType, loadedInputValue, regretsInputFieldLabel, loadedRegretsValue, validationErrors])


  useEffect(() => {
    if (inputValue !== loadedInputValue) { setIsSaveable(true) } else { setIsSaveable(false) }
    if (!loadedRegretsValue) return
    if (regretsInputValue !== loadedRegretsValue) setIsSaveable(true)
  }, [inputValue, loadedInputValue, regretsInputValue, loadedRegretsValue])


  return (
    <>
      <BasicFormAreaBG h2Text={formTitle}  >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            {(questionName === 'birthDate' || questionName === 'maxAge') && (
              <>{inputJSX}</>
            )}

            {(questionName !== 'birthDate' && questionName !== 'maxAge') && (
              <>{inputJSX}</>
            )}

            {(questionName === 'twentyFourHours' || questionName === 'oneWeek' || questionName === 'oneMonth' || questionName === 'oneYear') && (
              <>
                <div className="mt-4">
                  {regretsInputFieldJSX}
                </div>
              </>
            )}

            {/* //?  BUTTONS */}
            <div className='mt-2'>
              <FormButtons
                isSaveBtnDisabled={!isSaveable}
              />
            </div>
          </div>
        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default ClarityQuestionsEditModal

function formatDate(dateInput: string | number | null | undefined): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toISOString().slice(0, 10);
}





