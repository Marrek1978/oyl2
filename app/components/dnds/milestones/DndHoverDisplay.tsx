import Parser from 'html-react-parser';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDateDayDate } from '~/utils/functions';
import DatePicker from '~/components/list/DatePicker';
import ToggleWithLabel from '~/components/forms/ToggleWithLabel';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';

import type { Milestone } from '@prisma/client';
import { useFetcher, useNavigation } from '@remix-run/react';
import FormButtons from '~/components/forms/FormButtons';
import { saveBtnText } from '~/components/forms/FormsCommonFunctions';


type Props = {
  milestone: Milestone
  closeFunction?: () => void
  handleMouseOverFunc?: (event: any) => void
  handlenMouseOutFunc?: (event: any) => void
}

function DndHoverDisplay({ milestone, closeFunction = () => { }, handleMouseOverFunc, handlenMouseOutFunc }: Props) {

  const fetcher = useFetcher();
  const navigation = useNavigation();

  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [completedDate, setCompletedDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSaveable, setIsSaveable] = useState<boolean>(false)


  const saveBtnTxt = useMemo(() => saveBtnText(false, isSubmitting, 'Completed'), [isSubmitting])

  useEffect(() => {
    setIsSubmitting(navigation.state === 'submitting')
  }, [navigation.state])


  const header = (
    <>
      <div className='flex  flex-wrap items-baseline  gap-x-4'>
        <div className='' >{milestone.title}</div>
        <span className=' max-h-min mb-0 pb-0 text-sm' >
          {milestone.dueDate && <span className='text-sm max-h-min mb-0 pb-0' >Due: {formatDateDayDate(milestone.dueDate)}</span>}
        </span>
      </div>

    </>)


  const handleSendToDb = useCallback(() => {
    console.log('sending to DB')
    const toggledMilestone = {
      ...milestone,
      isComplete: !milestone.isComplete,
      completedAt: milestone.isComplete ? null : new Date()
    }
    const complete = {
      milestone: toggledMilestone,
      actionType: 'complete'
    }
    const submitedString = JSON.stringify(complete)
    try {
      fetcher.submit({
        submitedString
      }, {
        method: 'PUT',
      })
    } catch (error) { throw error }
  }, [milestone, fetcher])


  useEffect(() => {
    const isInputDifferent =
      isCompleted !== milestone?.isComplete
      || completedDate !== milestone?.completedAt
    setIsSaveable(isInputDifferent)
  }, [milestone, completedDate, isCompleted]);




  //loading
  useEffect(() => {
    setIsCompleted(milestone.isComplete)
    if (milestone.completedAt) {
      setCompletedDate(milestone.completedAt)
    }
  }, [milestone])


  //toggle completed
  const handleIsToggled = () => {
    isCompleted && completedDate && setCompletedDate(null)
    !isCompleted && !completedDate && setCompletedDate(new Date())
    setIsCompleted(!isCompleted)
  }

  useEffect(() => {
    if (!completedDate && isCompleted) setIsCompleted(false)
    if (completedDate && !isCompleted) setIsCompleted(true)
  }, [completedDate, isCompleted, handleSendToDb])


  const handleMouseOver = () => {
    handleMouseOverFunc && handleMouseOverFunc(true)
  }

  const handleMouseOut = () => {
    handlenMouseOutFunc && handlenMouseOutFunc(false)
  }


  return (
    <div className='fixed left-1/2  top-1/2
      transform -translate-x-1/2 -translate-y-1/2 
      max-w-[780px] w-full  p-8  
      z-50
      whitespace-pre-line 
      zindex-[30]
      '
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <BasicFormAreaBG title={header} >
        <section className='m-8 flex flex-col gap-8'>
          {milestone.description && (
            <div> {Parser(milestone.description)}</div>
          )}

          <div className='w-full flex items-center h-full gap-x-8 '>
            <div className='felx-1 max-w-max'>
              <ToggleWithLabel
                text='Completed?'
                checkedState={isCompleted}
                handleCheckedState={handleIsToggled}
              />
            </div>
            <div className='felx-1 w-[60%] '>
              <DatePicker
                labelText={'On'}
                selectedDate={completedDate}
                setSelectedDate={setCompletedDate}
                isHorizontal={true}
              />
            </div>
          </div>

          <FormButtons
            saveBtnTxt={saveBtnTxt}
            isSaveable={isSaveable}

            showCloseBtn={true}
            closeBtnText='Close'
            closeBtnOnClickFunction={closeFunction}
          />
        </section>
      </BasicFormAreaBG>
    </div>
  )
}

export default DndHoverDisplay