// import { v4 as uuidOutcomes } from "uuid";
import { useEffect, useState } from 'react'
import { Form, useFetcher, useNavigation, Link } from '@remix-run/react';

import Modal from "../modals/Modal";
import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from "./BasicFormAreaBG";
import OutlinedBtn from '../buttons/OutlinedBtn';
import SuccessMessage from "../modals/SuccessMessage";
import SolidBtnGreyBlue from "../buttons/SolidBtnGreyBlue";
import { dbIcon } from '../utilities/icons';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireOutcomeVisionDefaultText, DesireOutcomesDefaultText } from '~/components/utilities/PlaceHolderTexts';
import { DesireOutcomeGuideline, ProperDesireOutcomeVision, ProperDesireOutcomes } from "../utilities/Guidelines";

import type { DesireOutcome } from '@prisma/client';
import type { DesireWithValuesAndOutcomes } from '~/types/desireTypes'

interface DesireFormProps {
  desire?: DesireWithValuesAndOutcomes;
  outcome?: DesireOutcome;
  isNew?: boolean
}

function DesiresOutcomesForm({ desire, outcome, isNew = true }: DesireFormProps) {

  console.log('loading form')
  const fetcher = useFetcher();
  const navigation = useNavigation();

  const [desireId, setDesireId] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState('');
  const [desireTitle, setDesireTitle] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [outcomeTitle, setOutcomeTitle] = useState<string>('')
  const [outcomeVision, setOutcomeVision] = useState<string>('')
  const [outcomeSortOrder, setOutcomeSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [outcomeDescription, setOutcomeDescription] = useState<string>('')

  const loadedOutcomes = desire?.desireOutcomes

  const maxOutcomesSortOrder = Math.max(...loadedOutcomes?.map(outcome => outcome.sortOrder) || [0]);
  const nextSortOrder = isNew ? maxOutcomesSortOrder + 1 : desire?.sortOrder;

  const isIdle = navigation.state === 'idle'
  const isSubmitting = navigation.state === 'submitting'


  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNew
        ? "Save New Outcome"
        : "Save Change to Outcome"

  const header = isNew
    ? 'Create New Outcome'
    : (<>
      <div>
        <span className='text-sm' >
          Edit Outcome:
        </span>
      </div>
      <div>
        {outcomeTitle}
      </div>
    </>)


  useEffect(() => {
    setOutcomeTitle(outcome?.title || '')
    setOutcomeVision(outcome?.vision || '')
    setOutcomeDescription(outcome?.description || '')
    setOutcomeSortOrder(nextSortOrder || 0)
  }, [outcome, nextSortOrder])


  useEffect(() => {
    setDesireTitle(desire?.title || '')
    setDesireId(desire?.id || '')
  }, [desire])


  //  for turning buttons on/off, switching text
  useEffect(() => {

    const isInputEmpty = !outcomeTitle || !outcomeDescription
    const isInputDifferent =
      outcomeTitle !== desire?.title
      || outcomeDescription !== desire?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))

  }, [outcomeTitle, isNew, desire, outcomeDescription]);



  // clearing form after submit
  useEffect(() => {
    if (fetcher.state === 'loading') {
      setOutcomeTitle('')
      setOutcomeVision('')
      setOutcomeDescription('')
      setSuccessMessage(fetcher.data);
      setTimeout(() => setSuccessMessage(''), 1000);
    }
  }, [fetcher])


  const handleSave = () => {

    const outcomeObj = {
      title: outcomeTitle,
      description: outcomeDescription,
      vision: outcomeVision,
      desireId: desireId,
      sortOrder: outcomeSortOrder,
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
      vision: outcomeVision,
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
        title={header}
      >

        <Form method='post' className='mx-8 '>
          <div className='vert-space-between-inputs   '>
            <input type="string" name='desireId' value={desireId} hidden readOnly />
            <input type="string" name='desireTitle' value={desireTitle} hidden readOnly />

            <div className="form-control gap-6">
              <div>
                <InputLabelWithGuideLineLink
                  text='Outcome'
                  title='Outcomes'
                  guideline={DesireOutcomeGuideline}
                />
                <input type="text"
                  placeholder="Enter a List Title"
                  name='title'
                  value={outcomeTitle}
                  onChange={(e) => setOutcomeTitle(e.target.value)}
                  className=" input-field-text-title "
                  required
                />
              </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  text='Outcome Description'
                  title='Defining Proper Outcomes'
                  guideline={ProperDesireOutcomes} />
                <textarea
                  className='input-field-text-para '
                  placeholder={DesireOutcomesDefaultText}
                  name='outcomeDescription'
                  value={outcomeDescription}
                  onChange={(e) => setOutcomeDescription(e.target.value)}
                  required
                >
                </textarea>
              </div>

              <div className='  '>
                <InputLabelWithGuideLineLink
                  text='Outcome Vision'
                  title='Defining Proper Outcomes'
                  guideline={ProperDesireOutcomeVision} />
                <textarea
                  className='input-field-text-para '
                  placeholder={DesireOutcomeVisionDefaultText}
                  name='outcomeVision'
                  value={outcomeVision}
                  onChange={(e) => setOutcomeVision(e.target.value)}
                  required
                >
                </textarea>
              </div>

            </div>

            {/* //**************BUTTONS ***************  */}
            <div className="col-start-2 row-start-2 mb-8  vert-space-between-inputs">
              <div className="flex flex-col gap-4">
                <div className='mt-0 mb-0'>
                  <SolidBtn text={saveBtnText}
                    onClickFunction={isNew ? handleSave : handleEdit}
                    icon={dbIcon}
                    disableBtn={!isIdle || !isSaveable}
                    type='button'
                  />
                </div>

                {!isNew && (
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



