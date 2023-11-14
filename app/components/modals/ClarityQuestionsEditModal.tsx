import { Form, Link, useActionData } from '@remix-run/react'

import { closeIcon, dbIcon } from '../utilities/icons'
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue'

import type { ClarifyingQuestionsWithStringDates } from '~/types/clarityTypes';
import { TimeSpanPlaceHolderTextObj } from '../clarifyingQuestions/consts';

export type QuestionNameTypes = 'birthDate' | 'twentyFourHours' | 'oneWeek' | 'oneMonth' | 'oneYear' | 'fiveYears' | 'twentyYears' | 'fiftyYears'

interface ClarityQuestionsEditModalProps {
  questionName: QuestionNameTypes
  questions: ClarifyingQuestionsWithStringDates[]
}

function ClarityQuestionsEditModal({ questionName, questions }: ClarityQuestionsEditModalProps) {
  const validationErrors = useActionData() as string

  let regretsKey = (questionName + "Regrets") as keyof ClarifyingQuestionsWithStringDates;

  return (
    <>
      {/* <div className="
        card px-4 bg-base-100 
        rounded-none
        font-mont
        shadow-xl z-30
        "> */}
      <div className='
          bg-base-100 
          grid grid-cols-[minmax(300px,800px)] grid-rows-[72px_1fr_min-content]
          cursor-default  shadow-xl
          '>
        <div className='w-full h-full px-8 bg-base-content flex justify-between items-center'>
          <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              `}>
            {TimeSpanPlaceHolderTextObj[questionName + `Title`]}
          </div>
        </div>


        <Form method='post' className='m-8'>

          {questionName === 'birthDate' && (
            <>
              <div className="form-control flex-row gap-4">
                <label className="label">
                  <span className="label-text text-base font-mont font-medium">{TimeSpanPlaceHolderTextObj[questionName]}</span>
                </label>
                <input
                  type="date"
                  className=" w-56
                    input border-none input-secondary 
                    bg-base-200 rounded-none
                    font-poppins font-normal  leading-snug"
                  name={questionName}
                  defaultValue={(questions && questions[0] && questions[0][questionName])
                    ? new Date(questions[0][questionName]).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)
                  }
                >
                </input>
              </div>

              {validationErrors && (
                <div className='text-red-700'> {validationErrors}</div>
              )}
            </>
          )}

          {(questionName !== 'birthDate') && (
            <>
              <div className="form-control ">
                <label className="label">
                  <span className="label-text text-base font-mont font-medium">{TimeSpanPlaceHolderTextObj[questionName]}</span>
                </label>
                <textarea
                  className="w-full 
                    textarea textarea-bordered h-24 
                    input border-none input-secondary 
                    bg-base-200 rounded-none
                    font-poppins font-normal  leading-snug"
                  placeholder="I would..."
                  name={questionName}
                  defaultValue={(questions && questions[0] && questions[0][questionName])
                    ? questions[0][questionName] as string
                    : ''
                  }
                >
                </textarea>
              </div>
            </>
          )}

          {(questionName === 'twentyFourHours' || questionName === 'oneWeek' || questionName === 'oneMonth' || questionName === 'oneYear') && (
            <>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-base font-mont font-medium">
                    {TimeSpanPlaceHolderTextObj[regretsKey]}
                  </span>

                </label>
                <textarea
                  className="w-full 
                  textarea textarea-bordered h-24 
                  input border-none input-secondary 
                  bg-base-200 rounded-none
                  font-poppins font-normal  leading-snug"
                  placeholder="I would regret..."
                  name={regretsKey}
                  defaultValue={(questions && questions[0] && questions[0][regretsKey])
                    ? questions[0][regretsKey] as string
                    : ''
                  }
                >
                </textarea>
              </div>
            </>
          )}



          {/* //?  BUTTONS */}
          <div className="flex gap-6 w-full justify-between mt-8">
            <Link to='..' className='w-6/12 flex gap-2 flex-1 '>
              <SolidBtnGreyBlue
                text='Cancel Edit'
                onClickFunction={() => { }}
                icon={closeIcon}
              />
            </Link>
            <div className='flex-1'>
              <button
                className="btn btn-error rounded-none w-full"
                type='submit'

              >Save {dbIcon}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ClarityQuestionsEditModal
