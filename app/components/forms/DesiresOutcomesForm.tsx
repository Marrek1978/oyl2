// import { v4 as uuidOutcomes } from "uuid";
import { useEffect, useState } from 'react'
import { Form, useActionData, useFetcher, useNavigation, useLocation, Link } from '@remix-run/react';

import Modal from "../modals/Modal";
import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from "./BasicFormAreaBG";
import OutlinedBtn from '../buttons/OutlinedBtn';
import SuccessMessage from "../modals/SuccessMessage";
import SolidBtnGreyBlue from "../buttons/SolidBtnGreyBlue";
import { dbIcon } from '../utilities/icons';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireCurrentSituation } from '~/components/utilities/PlaceHolderTexts';
import { DesireOutcomeGuideline, ProperDesireOutcomes } from "../utilities/Guidelines";

import type { DesireOutcome } from '@prisma/client';
import type { DesireWithValues } from '~/types/desireTypes'

interface DesireFormProps {
  desire?: DesireWithValues;
  outcome?: DesireOutcome;
}

function DesiresOutcomesForm({ desire, outcome }: DesireFormProps) {

  const fetcher = useFetcher();
  const location = useLocation();
  const navigation = useNavigation();
  const validationErrors = useActionData()

  //!!  make client side  console.log('validation errors = ', validationErrors)

  const [desireId, setDesireId] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState('');
  const [desireTitle, setDesireTitle] = useState<string>('')
  const [editsMade, setEditsMade] = useState<boolean>(false) //true if outcome is new, false if outcome is existing
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [outcomeTitle, setOutcomeTitle] = useState<string>('')
  const [isNewOutcome, setIsNewOutcome] = useState<boolean>(true) //true if outcome is new, false if outcome is existing
  const [outcomeDescription, setOutcomeDescription] = useState<string>('')

  const isIdle = navigation.state === 'idle'
  const isSubmitting = navigation.state === 'submitting'


  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNewOutcome
        ? "Save New Outcome"
        : "Save Changes"

  // loading data for editing
  useEffect(() => {
    setOutcomeTitle(outcome?.title || '')
    setOutcomeDescription(outcome?.description || '')
  }, [outcome])


  // ?switch for edits vs new
  useEffect(() => {
    const pathArray = location.pathname.split('/');
    if (pathArray.length === 5) {
      setIsNewOutcome(true);
    } else if (pathArray.length === 6) {
      setIsNewOutcome(false);
    }
  }, [location.pathname]);


  //  load desire title, should always be available
  useEffect(() => {
    setDesireTitle(desire?.title || '')
    setDesireId(desire?.id || '')
  }, [desire])


  //  for turning buttons on/off, switching text
  useEffect(() => {
    const saveable =
      !isNewOutcome
        ? editsMade
        : outcomeTitle ? true : false
    setIsSaveable(saveable)
  }, [outcomeTitle, isNewOutcome, editsMade]);


  useEffect(() => {
    if (outcomeTitle !== outcome?.title) return setEditsMade(true)
    if (outcomeDescription !== outcome?.description) return setEditsMade(true)
    setEditsMade(false)
  }, [outcomeTitle, outcomeDescription]) // eslint-disable-line react-hooks/exhaustive-deps


  // clearing form after submit
  useEffect(() => {
    if (fetcher.state === 'loading') {
      setOutcomeTitle('')
      setOutcomeDescription('')
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 1000);
    }
  }, [fetcher])


  const handleSave = () => {
    const outcomeObj = {
      title: outcomeTitle,
      description: outcomeDescription,
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
          <SuccessMessage
            text={successMessage}
          />
        </Modal>)
      }

      <BasicFormAreaBG
        maxWidth="1200"
        title={isNewOutcome
          ? (<div ><span className='text-sm' >Create a New Outcome for: </span> {desireTitle}</div>)
          : (<div ><span className='text-sm' >Edit Outcomes for:</span> {desireTitle}</div>)}
      >

        <Form method='post' className='mx-8 '>
          <div className='vert-space-between-inputs   '>
            <input type="string" name='desireId' value={desireId} hidden readOnly />

            <div className="form-control gap-6">
              <div>
                <InputLabelWithGuideLineLink
                  text='Outcome'
                  title='Outcomes'
                  guideline={DesireOutcomeGuideline} />
                <input type="text"
                  placeholder="Enter a List Title"
                  name='title'
                  value={outcomeTitle}
                  onChange={(e) => setOutcomeTitle(e.target.value)}
                  className=" input-field-text-title "
                />
                {validationErrors?.title && (
                  <div className='validation-error'> {validationErrors.title}</div>
                )}
              </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  text='Outcome Description'
                  title='Defining Proper Outcomes'
                  guideline={ProperDesireOutcomes} />
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
            </div>

            {/* //**************BUTTONS ***************  */}
            <div className="col-start-2 row-start-2 mb-8  vert-space-between-inputs">
              <div className="flex flex-col gap-4">
                <div className='mt-0 mb-0'>
                  <SolidBtn text={saveBtnText}
                    onClickFunction={isNewOutcome ? handleSave : handleEdit}
                    icon={dbIcon}
                    disableSaveBtn={!isIdle || !isSaveable}
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
          </div>
        </Form>
      </BasicFormAreaBG >
    </>
  )
}

export default DesiresOutcomesForm



