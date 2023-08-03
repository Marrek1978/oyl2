import { v4 as uuidOutcomes } from "uuid";
import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react';

import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import { ArrowIcon45deg, dbIcon } from '../utilities/icons';
// import BasicFormAreaBG from './BasicFormAreaBG';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'
import OutlinedBtn from '../buttons/OutlinedBtn';
import DndProgress from '../dnds/outcomes/progress/DndProgress';

import type { DesireOutcomeProgress } from "@prisma/client";
import type { NewlyCreatedProgress } from "~/types/progressTypes";
import Divider from "../utilities/Divider";
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import DatePicker from "../list/DatePicker";
import LargeFormWithHeader from "./LargeFormWithHeader";
import HeadingH2 from "../titles/HeadingH2";
import SubHeading14px from "../titles/SubHeading14px";
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
  const [outcomeDueDate, setOutcomeDueDate] = useState<Date | null>(null)
  const [formattedOutcomeDueDate, setFormattedOutcomeDueDate] = useState<string | null>(null)

  const [progress, setProgress] = useState<string>('') //if adding new desire, set to desires.length
  const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)

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


  useEffect(() => {

    outcomeDueDate && setFormattedOutcomeDueDate(shortenDate(outcomeDueDate))

  }, [outcomeDueDate])

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
    <LargeFormWithHeader
      title={`Create Outcome for  ${desireTitle}`}
    >

      <Form method='post' className='mx-0'>

        <div className=' 
          bg-base-100 
          grid grid-cols-2 grid-rows-[1fr_min-content]
          cursor-default 
          p-12  gap-x-20 gap-y-8
          '>

          <div className="col-start-1 row-start-1">
            <div className="form-control gap-6 ">
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

              <div className='  '>
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

              <DatePicker
                setSelectedDate={setOutcomeDueDate}
                selectedDate={outcomeDueDate}
                labelText="Due On or Before"
              />

              <div className="m-8">
                <Divider />
              </div>

              <div className=' '>
                <InputLabel text='Evidence of Progress towards Outcome' />
                <input type="text"
                  placeholder="Evidence"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className=" input-field-text-title "
                />
              </div>


              <DatePicker
                setSelectedDate={setProgressDueDate}
                selectedDate={progressDueDate}
                labelText="Progress Due On or Before"
              />

            </div>
          </div>

          <div className="col-start-1 row-start-2">
            <div className='mt-0'>
              <OutlinedBtn
                text='Add Evidence'
                icon={ArrowIcon45deg}
                onClickFunction={handleAddEvidence}
                // disabledBtnBoolean={!progress}
                daisyUIBtnColor='primary'
                type='button'
              />
            </div>
          </div>

          <div className="col-start-2 row-start-1">
            <div className={outcomeTitle ? 'text-base-content' : 'text-base-content/60'}  >
              <HeadingH2 text={outcomeTitle || 'Outcome Title'} />
              {outcomeDueDate && (
                <div className="text-base-content/60">
                <SubHeading14px text={`Due On or Before:  ${formattedOutcomeDueDate}`} />
                </div>
              )}
            </div>
            <div>
              <DndProgress
                progressList={progressList}
              />
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className="col-start-2 row-start-2">
            <div className='mt-0 mb-0'>
              <SolidBtn text={isSubmitting ? 'Saving...' : 'Save Edits'}
                onClickFunction={() => { }}
                icon={dbIcon}
                disableSaveBtn={isSubmitting || !isSaveable}
              />
            </div>
          </div>
        </div >
      </Form>
    </LargeFormWithHeader>

  )
}

export default DesiresOutcomesForm


// const formatDateFromString = (dateString: Date | null) => {
//   if (!dateString) return null;
//   const date = new Date(dateString);
//   return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
// };

const shortenDate = (date: Date) => {
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
};


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