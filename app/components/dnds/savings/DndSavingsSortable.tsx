import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';

import DndSortableStyling from "../DndSortableStyling";
import H2WithLink from "~/components/headers/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";

import type { Savings } from "@prisma/client";
import HeadingH1 from "~/components/headers/HeadingH1";
import { currStringToNum } from "~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.savings";


interface DndSavingSortableProps {
  saving: Savings;
  linkTitle?: string;
  isShowDescription?: boolean;
  estCompDate: Date;
  savedAmount?: number;
}

function DndSavingSortable({ saving, linkTitle = 'Edit', isShowDescription = true, estCompDate, savedAmount }: DndSavingSortableProps) {

  const [id, setId] = useState<string>('')
  const [description, setDescription] = useState<string | null>('')
  const [currencyReqd, setCurrencyReqd] = useState<string>()
  const [currencySaved, setCurrencySaved] = useState<string>('0')
  const [isPaidInFull, setIsPaidInFull] = useState<boolean>(false)


  useEffect(() => {
    if (!saving) return
    setId(saving?.id || '')
    setDescription(saving?.description)
    savedAmount && setCurrencySaved(savedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
    setCurrencyReqd(saving.requiredAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
  }, [saving, savedAmount, currencyReqd, currencySaved, description, id, setId, setDescription, setCurrencyReqd, setCurrencySaved])


  useEffect(() => {
    if (!currencyReqd || !currencySaved) return
    const reqdNum = currStringToNum(currencyReqd)
    const savedNum = currStringToNum(currencySaved)
    if (savedNum >= reqdNum) { setIsPaidInFull(true) }
    else { setIsPaidInFull(false) }
  }, [currencyReqd, currencySaved])


  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className=" ">
        <DndSortableStyling id={id} priorityStyling={''}>

          <div className="flex gap-2 items-baseline wrap">
            <span className="text-sm max-w-max">{saving.sortOrder + 1}</span>.

            <div className="max-w-64 w-full truncate">
              <H2WithLink
                h2Text={saving.title}
                linkDestination={id}
                linkText={linkTitle}
                btnColorDaisyUI={'link'}
              />

              <div className={`mt-2 ${isPaidInFull && 'text-success'}`}>
                <HeadingH1 H1Title={`${currencySaved} / ${currencyReqd}`} />
              </div>

              {isShowDescription && (
                <div className="mt-1 ">
                  <TextProseWidth
                    text={description || ''}
                  />
                </div>
              )}

              <div className="mt-0 items-baseline text-sm text-left w-full para-color">
                Est. Saved Date: <span className="font-bold text-base" > {estCompDate.toDateString()}</span>
              </div>
            </div>
          </div>
        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSavingSortable

