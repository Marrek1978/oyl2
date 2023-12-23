import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';

import DndSortableStyling from "../DndSortableStyling";
import H2WithLink from "~/components/titles/H2WithLink";
import TextProseWidth from "~/components/text/TextProseWidth";

import type { Savings } from "@prisma/client";


interface DndSavingSortableProps {
  saving: Savings;
  linkTitle?: string;
  isShowDescription?: boolean;
  estCompDate: Date;
}

function DndSavingSortable({ saving, linkTitle = 'Edit', isShowDescription = true, estCompDate }: DndSavingSortableProps) {

  const [id, setId] = useState<string>('')
  const [description, setDescription] = useState<string | null>('')
  const [currencyReqd, setCurrencyReqd] = useState<string>()
  const [currencySaved, setCurrencySaved] = useState<string>('0')

  useEffect(() => {
    if (!saving) return
    setId(saving?.id || '')
    setDescription(saving?.description)
    // setCurrencySaved(saving.savedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace(/\.00$/, ''))
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
    <div className="ml-4">
      {currencySaved} / {currencyReqd}
    </div>
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

          {isShowDescription && (
            <div className="mt-2 ">
              <TextProseWidth
                text={description || ''}
              />
            </div>
          )}

          <div className=" ml-4 mt-0 items-baseline text-sm text-left w-full para-color">
            Est. Saved Date: <span className="font-bold text-base" > {estCompDate.toDateString()}</span>
          </div>

        </DndSortableStyling>
      </div>
    </>
  )
}

export default DndSavingSortable

