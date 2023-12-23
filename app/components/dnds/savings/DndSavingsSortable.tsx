import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';

import DndSortableStyling from "../DndSortableStyling";
import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";
import SubHeading14px from "~/components/titles/SubHeading14px";
import SubHeading12px from "~/components/titles/SubHeading12px";

import type { Savings } from "@prisma/client";
import { setAsCurrency } from "~/components/forms/savings/SavingForm";


interface SortableGenericProps {
  saving: Savings;
  linkTitle?: string;
  isShowDescription?: boolean;
  monthsLeft: string;
  currentMonth:number;
}

function DndSortableGeneric({ saving, linkTitle = 'Edit', isShowDescription = true , monthsLeft, currentMonth}: SortableGenericProps) {


  const [id, setId] = useState<string>('')
  const [description, setDescription] = useState<string | null>('')
  const [amtReqd, setAmtReqd] = useState<number>()
  const [amtSaved, setAmtSaved] = useState<number>(0)
  // const [amtMonthly, setAmtMonthly] = useState<number>()

  const [currencyReqd, setCurrencyReqd] = useState<string>()
  const [currencySaved, setCurrencySaved] = useState<string>()
  const [currencyMonthly, setCurrencyMonthly] = useState<string>()

  // const [monthsLeft, setMonthsLeft] = useState<number>()

  useEffect(() => {
    if (!saving) return
    setId(saving?.id || '')
    setDescription(saving?.description)
    setAmtReqd(saving?.requiredAmount || 0)
    setAmtSaved(saving?.savedAmount || 0)
    // setAmtMonthly(saving?.monthlyContribution || 0)
    setCurrencySaved(saving.savedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
    setCurrencyReqd(saving.requiredAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
  }, [saving])


  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  const title = (<>
    <div>
      <span className="text-sm">{saving.sortOrder + 1}</span>. <span className="text-lg">{saving.title}</span>
    </div>
    {currencySaved} / {currencyReqd}
  </>)




  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" ">
        <DndSortableStyling id={id} priorityStyling={''}>
          <H2WithLink
            h2Text={title}
            linkDestination={id}
            linkText={linkTitle}
            btnColorDaisyUI={'link'}
          />

          <div className="mt-2 ">
            {isShowDescription && (
              <TextProseWidth
                text={description || ''}
              />
            )}
          </div>

          <div className="flex gap-2 items-baseline text-sm">
           Est. {monthsLeft} months left
          </div>


          {/* <div className="flex gap-2 items-baseline">
            <SubHeading14px text={`${currencySaved || '0'} / ${currencyReqd}`} />
            {monthsLeft}
          </div> */}

          {/* <div className="flex gap-2 items-baseline">
            <SubHeading12px text='Total Required' />
            {currencyReqd}
          </div> */}

          {/* <div className="flex gap-2 items-baseline">
            <SubHeading12px text='Amount Saved to Date' />
            {currencySaved}
          </div> */}

          {/* <div className="flex gap-2 items-baseline">
            <SubHeading12px text='Monthly Payment: ' />
            {currencyMonthly}
          </div> */}

        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSortableGeneric

