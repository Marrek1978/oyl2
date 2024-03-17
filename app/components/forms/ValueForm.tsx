import { Form } from '@remix-run/react'
import { useState, useEffect, useMemo } from 'react';

import FormButtons from '~/components/buttons/FormButtons';
import BasicFormAreaBG from '~/components/forms/util/BasicFormAreaBG';
import useServerMessages from '~/components/displays/modals/useServerMessages';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines';
import { headerText, useSaveBtnText } from '~/components/forms/util/FormsCommonFunctions';
import InputLabelWithGuideLineLink from '~/components/forms/inputs/InputLabelWithGuideLineLink';

import type { Value } from '@prisma/client';

interface ValueFormProps {
  value?: Value
  isNew?: boolean
  nextSortOrder?: number
}

function ValueForm({ value, isNew = true, nextSortOrder }: ValueFormProps) {

  const [title, setTitle] = useState<string>('')
  const [valueId, setValueId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle, navigationState } = useGetNavigationState()
  useServerMessages({ fetcherState: navigationState,   isShowFailed: true})

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Value')
  const headerTxt = useMemo(() => headerText(isNew, 'value', value?.title || ''), [isNew, value?.title])



  useEffect(() => {
    setTitle(value?.title || '')
    setDescription(value?.description || '')
    setSortOrder(value?.sortOrder || nextSortOrder || 0)
    setValueId(value?.id || '')
  }, [nextSortOrder, value])


  useEffect(() => {
    const isInputEmpty = !title || !description
    const isInputDifferent =
      title !== value?.title
      || description !== value?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, value,]);


  return (
    <BasicFormAreaBG h2Text={headerTxt}  >

      <Form method='post' className='p-8'>
        <div className="form-control gap-y-6 ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='rowId' value={valueId} hidden readOnly />

          <div>
            <InputLabelWithGuideLineLink
              inputTitle='Value'
              guideline={CoreValue}
              guideLineTitle='Values'
            />
            <input type="text"
              placeholder="Enter a Value Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className=''>
            <InputLabelWithGuideLineLink
              inputTitle='Value Statement'
              guideline={CoreValueStatement}
              guideLineTitle='Value Statement'
            />
            <textarea
              className="input-field-text-para "
              placeholder="Describe what you value. You can describe why you value somethihng, but do not spend any time justifying your value."
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            >
            </textarea>
          </div>


          {/* //**************BUTTONS ***************  */}
          <div className='mt-2'>
            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable || !isIdle}
              isNew={isNew}
              isShowCloseBtn={!isNew}
            />
          </div>
        </div>

      </Form>
    </BasicFormAreaBG>
  )
}

export default ValueForm