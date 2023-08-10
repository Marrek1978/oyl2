import { v4 as uuidOutcomes } from "uuid";
import { useEffect, useState } from 'react'
import { Form, useActionData, useFetcher, useNavigation, useLocation, Link } from '@remix-run/react';

import InputLabel from './InputLabel';
import Divider from "../utilities/Divider";
import SolidBtn from '../buttons/SolidBtn';
import DatePicker from "../list/DatePicker";
import HeadingH2 from "../titles/HeadingH2";
import OutlinedBtn from '../buttons/OutlinedBtn';
import SubHeading14px from "../titles/SubHeading14px";
import LargeFormWithHeader from "./LargeFormWithHeader";
import { ArrowIcon45deg, dbIcon } from '../utilities/icons';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';

import DndProgress from '../dnds/outcomes/progress/DndProgress';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';

import type { DesireWithValues } from '~/types/desireTypes'
import type { DesireOutcomeProgress } from "@prisma/client";
import type { NewlyCreatedProgress } from "~/types/progressTypes";
import Modal from "../modals/Modal";
import SuccessMessage from "../modals/SuccessMessage";
import type { OutcomeWithProgressList } from "~/types/outcomeTypes";
import SolidBtnGreyBlue from "../buttons/SolidBtnGreyBlue";
import { CoreValue } from "../utilities/Guidelines";
interface DesireFormProps {
  desire?: DesireWithValues;
  outcome?: OutcomeWithProgressList;
}

function DesiresOutcomesForm({ desire, outcome }: DesireFormProps) {

  const fetcher = useFetcher();
  const navigation = useNavigation();
  const validationErrors = useActionData()

  //!!  make client side  console.log('validation errors = ', validationErrors)
  
  const [desireId, setDesireId] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState('');
  const [desireTitle, setDesireTitle] = useState<string>('')
  const [outcomeTitle, setOutcomeTitle] = useState<string>('')
  const [outcomeDueDate, setOutcomeDueDate] = useState<Date | null>(null)
  const [outcomeDescription, setOutcomeDescription] = useState<string>('')
  const [formattedOutcomeDueDate, setFormattedOutcomeDueDate] = useState<string | null>(null)
  const [progressList, setProgressList] = useState<DesireOutcomeProgress[] | NewlyCreatedProgress[]>([])
  const [isNewOutcome, setIsNewOutcome] = useState<boolean>(true) //true if outcome is new, false if outcome is existing

  const [progress, setProgress] = useState<string>('') //if adding new desire, set to desires.length
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [progressDueDate, setProgressDueDate] = useState<Date | null>(null)

  const isSubmitting = navigation.state === 'submitting'

  const location = useLocation();

  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNewOutcome
        ? "Save New Outcome"
        : "Save Changes"


  //loading data to edit
  useEffect(() => {
    if (outcome) {
      setOutcomeTitle(outcome.title || '')
      setOutcomeDescription(outcome.description || '')
      setOutcomeDueDate(outcome.dueDate ? new Date(outcome.dueDate) : null)
      setProgressList(outcome.desireOutcomeProgress || [])
    }
  }, [outcome])


  //switch for edis vs new
  useEffect(() => {
    const pathArray = location.pathname.split('/');
    if (pathArray.length === 5) {
      setIsNewOutcome(true);
    } else if (pathArray.length === 6) {
      setIsNewOutcome(false);
    }
  }, [location.pathname]);


  //load desire title, should always be available
  useEffect(() => {
    setDesireTitle(desire?.title || '')
    setDesireId(desire?.id || '')
  }, [desire])


  // for turning buttons on/off, switching text
  useEffect(() => {
    const saveable =
      !isNewOutcome
        ? true
        : outcomeTitle ? true : false
    setIsSaveable(saveable)
  }, [outcomeTitle, isNewOutcome]);



  //formatting date for display
  useEffect(() => {
    const outcomeDueDateDateObj = new Date(outcomeDueDate as Date)
    outcomeDueDate && setFormattedOutcomeDueDate(shortenDate(outcomeDueDateDateObj))
  }, [outcomeDueDate])


  //clearing form after submit
  useEffect(() => {
    if (fetcher.state === 'loading') {
      setOutcomeTitle('')
      setOutcomeDescription('')
      setOutcomeDueDate(null)
      setProgressList([])
      setSuccessMessage('List was saved');
      setTimeout(() => setSuccessMessage(''), 1000);
    }
  }, [fetcher])


  const handleAddProgress = () => {
    if (progress) {
      const newProgressTyped: NewlyCreatedProgress = {
        id: uuidOutcomes(),
        title: progress,
        sortOrder: progressList.length,
        description: null,
        dueDate: progressDueDate,
        complete: false,
        desireOutcomeId: uuidOutcomes(),
      }
      setProgressList([...progressList, newProgressTyped])
      setProgress('')
    }
  }


  const handleSave = () => {
    const outcomeObj = {
      title: outcomeTitle,
      description: outcomeDescription,
      dueDate: outcomeDueDate,
      progressList,
      desireId: desireId,
    }
    const outcomeString = JSON.stringify(outcomeObj);
    try {
      fetcher.submit({
        outcomeString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
  }


  const handleEdit = () => {
    const outcomeObj = {
      id: outcome?.id,
      title: outcomeTitle,
      description: outcomeDescription,
      dueDate: outcomeDueDate,
      desireOutcomeProgress: progressList,
      desireId: desireId,
    }
    const outcomeString = JSON.stringify(outcomeObj);
    try {
      fetcher.submit({
        outcomeString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
  }

  return (
    <>
      {successMessage && (
        <Modal onClose={() => { }} zIndex={20}>
          {successMessage}
          <SuccessMessage
            text={'Outcome was Saved'}
          />
        </Modal>)
      }

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
                  <InputLabelWithGuideLineLink text='Outcome Title' guideline={CoreValue} />
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
                    placeholder="Evidence of Progress"
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
                  onClickFunction={handleAddProgress}
                  disabledBtnBoolean={!progress}
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
                {outcomeDescription && (
                  <div className="mt-2">
                    <p className="text-base-content/60">
                      {outcomeDescription}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <DndProgress
                  progressList={progressList}
                  setProgressList={setProgressList}
                />
              </div>
            </div>

            {/* //**************BUTTONS ***************  */}
            <div className="col-start-2 row-start-2">

              <div className="flex flex-col gap-4">
                <div className='mt-0 mb-0'>
                  <SolidBtn text={saveBtnText}
                    onClickFunction={isNewOutcome ? handleSave : handleEdit}
                    icon={dbIcon}
                    disableSaveBtn={isSubmitting || !isSaveable}
                    type='button'
                  />
                </div>

                {!isNewOutcome && (
                  <>
                    <Link to='..' >
                      <SolidBtnGreyBlue
                        text='Close w/o saving'
                        onClickFunction={() => { }}
                      />
                    </Link>

                    <Link to='delete' >
                      <OutlinedBtn
                        text='Delete Outcome'
                        onClickFunction={() => { }}
                        daisyUIBtnColor='error'
                      />
                    </Link>
                  </>
                )}

              </div>
            </div>
          </div >
        </Form>
      </LargeFormWithHeader>
    </>
  )
}

export default DesiresOutcomesForm


const shortenDate = (date: Date) => {

  if (!(date instanceof Date)) {
    throw new Error('date should be a Date object');
  }


  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDay()}, ${date.getFullYear()}`;
};

 