import { v4 as uuidOutcomes } from "uuid";
import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react';

import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import { dbIcon, downArrowsIcon } from '../utilities/icons';
import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'
import OutlinedBtn from '../buttons/OutlinedBtn';
import DndProgress from '../dnds/outcomes/progress/DndProgress';

import type { DesireOutcomeProgress } from "@prisma/client";
import type { NewlyCreatedProgress } from "~/types/progressTypes";
import Divider from "../utilities/Divider";
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
interface DesireFormProps {
  desire?: DesireWithValues

}


function DesiresOutcomesForm({ desire }: DesireFormProps) {
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [desireId, setDesireId] = useState<string>('')
  const [desireTitle, setDesireTitle] = useState<string>('')
  const [progressList, setProgressList] = useState<DesireOutcomeProgress[] | NewlyCreatedProgress[]>([])

  const [outcomeTitle, setOutcomeTitle] = useState<string>('')
  const [outcomeDescription, setOutcomeDescription] = useState<string>('')
  // const [outcomeDueDate, setOutcomeDueDate] = useState<Date | null>(null)

  const [progress, setProgress] = useState<string>('') //if adding new desire, set to desires.length
  // const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)
  // const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)
  // const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)

  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    setDesireTitle(desire?.title || '')
    setDesireId(desire?.id || '')
    // setCurrent(desire?.current || '')
  }, [desire])


  useEffect(() => {
    const isInputEmpty = !outcomeTitle
    // const isInputDifferent = current !== desire?.current
    // const isInputDifferent = description !== desire?.outcome.description
    setIsSaveable(!isInputEmpty)
    // setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [outcomeTitle]);


  const handleAddEvidence = () => {
    if (progress) {
      //make into proper type with id

      const newProgressTyped: NewlyCreatedProgress = {
        id: uuidOutcomes(),
        title: progress,
        sortOrder: progressList.length,
        description: null,
        dueDate: null,
        // dueDate: progressDueDate,
        complete: false,
        desireOutcomeId: uuidOutcomes(),
      }

      setProgressList([...progressList, newProgressTyped])
      setProgress('')
    }
  }

  //! any need for progress description ??

  return (
    <BasicFormAreaBG
      title={`Specific Outcomes for  ${desireTitle}`}
    >

      <Form method='post' className='mx-8'>
        < div className="form-control gap-6 vert-space-between-inputs">
          <input type="string" name='desireId' value={desireId} hidden readOnly />

          <div className=''>
            
            <InputLabelWithGuideLineLink text='Outcome Title' guideline={myLoremIpsumText} />
            <input type="text"
              placeholder="Enter a List Title"
              value={outcomeTitle}
              onChange={(e) => setOutcomeTitle(e.target.value)}
              className=" input-field-text-title "
            />
            {validationErrors?.title && (
              <div className='validation-error'> {validationErrors.title}</div>
            )}
          </div>

          <div className='pb-0 mb-0 '>
            <InputLabel text='Outcome Description ( Optional )' />
            <textarea
              className='input-field-text-para '
              placeholder={DesireCurrentSituation}
              name='outcomeDescription'
              value={outcomeDescription}
              onChange={(e) => setOutcomeDescription(e.target.value)}
            >
            </textarea>
            {validationErrors?.description && (
              <div className='validation-error'> {validationErrors.description}</div>
            )}
          </div>

          <InputLabel text='Outcome Due Date' />

          <Divider />

          <div className=' '>
            <InputLabel text='Evidence of Progress towards Outcome' />
            <input type="text"
              placeholder="Evidence"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className=" input-field-text-title "
            />
          </div>


          <InputLabel text='progress  Due Date' />

          <OutlinedBtn
            text='Add Evidence'
            icon={downArrowsIcon}
            onClickFunction={handleAddEvidence}
            // disabledBtnBoolean={!progress}
            daisyUIBtnColor='primary'
            type='button'
          />

          <div>
            <DndProgress
              progressList={progressList}
            />
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6 mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits'}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableSaveBtn={isSubmitting || !isSaveable}
            />
          </div>
        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default DesiresOutcomesForm



const myLoremIpsumText = `
Lorem ipsum dolor sit amet, \n
   consectetur adipiscing elit. Sed non risus. \n
   Suspendisse lectus tortor, dignissim sit amet, \n
    adipiscing nec, ultricies sed, dolor. Cras elementum ultrices \n
    Lorem ipsum dolor sit amet, \n
   consectetur adipiscing elit. Sed non risus. \n
   Suspendisse lectus tortor, dignissim sit amet, \n
    adipiscing nec, ultricies sed, dolor. Cras elementum ultrices \n
    Lorem ipsum dolor sit amet, \n
   consectetur adipiscing elit. Sed non risus. \n
   Suspendisse lectus tortor, dignissim sit amet, \n
    adipiscing nec, ultricies sed, dolor. Cras elementum ultrices \n`