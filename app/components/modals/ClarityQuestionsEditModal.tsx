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
  const [inputFieldLabel, setInputFieldLabel] = useState<string>('')
  const [inputFieldJSX, setInputFieldJSX] = useState<ReactNode>(null)
  const [regretsInputFieldLabel, setRegretsInputFieldLabel] = useState<string>('')
  const [defaultValue, setDefaultValue] = useState<string | number | undefined>('')
  const [regretsInputFieldJSX, setRegretsInputFieldJSX] = useState<ReactNode>(null)
  const [defaultRegretsValue, setDefaultRegretsValue] = useState<string | number | undefined>()
  const [fieldValue, setFieldValue] = useState<string | number | undefined>('')


  useEffect(() => {

    if (!questions || !questions[0]) return
    setInputFieldLabel(TimeSpanPlaceHolderTextObj[questionName])
    setFormTitle(TimeSpanPlaceHolderTextObj[questionName + `Title`])

    if (questionName === 'birthDate') {
      setDefaultValue(formatDate(questions && questions[0] && questions[0][questionName]?.toISOString()))
      setInputType('date')
      setInputFieldJSX(
        <TextInputField
          inputFieldLabel={inputFieldLabel}
          inputType={inputType}
          defaultValue={defaultValue}
          fieldName={questionName}
          validationErrors={validationErrors}
         onChangeSetter={setFieldValue}
        />
      )
    }

    if (questionName === 'maxAge') {
      setDefaultValue(questions && questions[0] && questions[0][questionName] || 76)
      setInputType('number')
      setInputFieldJSX(
        <TextInputField
          inputFieldLabel={inputFieldLabel}
          inputType={inputType}
          defaultValue={defaultValue}
          fieldName={questionName}
          validationErrors={validationErrors}
        />
      )
    }

    if (questionName !== 'birthDate' && questionName !== 'maxAge') {
      setDefaultValue((questions && questions[0] && questions[0][questionName])
        ? questions[0][questionName] as string
        : '')
      setInputFieldJSX(
        <TextAreaInputField
          inputFieldLabel={inputFieldLabel}
          fieldName={questionName}
          defaultValue={defaultValue}
          placeholder={'I would...'}
          validationErrors={validationErrors}
        />
      )
    }

    //*********************  REGRET FIELDS ***************** */
    if (questionName === 'twentyFourHours' || questionName === 'oneWeek' || questionName === 'oneMonth' || questionName === 'oneYear') {
      setRegretsInputFieldLabel(TimeSpanPlaceHolderTextObj[regretsKey])
      setDefaultRegretsValue((questions && questions[0] && questions[0][regretsKey])
        ? questions[0][regretsKey] as string
        : '')
      setRegretsInputFieldJSX(
        <TextAreaInputField
          inputFieldLabel={regretsInputFieldLabel}
          fieldName={regretsKey}
          defaultValue={defaultRegretsValue}
          placeholder={'I would regret...'}
          validationErrors={validationErrors}
        />
      )
    }

  }, [questions, questionName, regretsKey, inputFieldLabel, inputType, defaultValue, regretsInputFieldLabel, defaultRegretsValue, validationErrors])



  return (
    <>
      <BasicFormAreaBG h2Text={formTitle}  >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            {(questionName === 'birthDate' || questionName === 'maxAge') && (
              <>{inputFieldJSX}</>
            )}

            {(questionName !== 'birthDate' && questionName !== 'maxAge') && (
              <>{inputFieldJSX}</>
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
              <FormButtons />
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





