import { useState, useEffect, useMemo } from 'react';
import { Form } from '@remix-run/react'


import type { Value } from '@prisma/client';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { CoreValue, CoreValueStatement } from '../utilities/Guidelines';
import BasicFormAreaBG from './BasicFormAreaBG';
import { headerText, useSaveBtnText } from './FormsCommonFunctions';
import FormButtons from './FormButtons';
import useGetNavigationState from '../utilities/useNavigationState';

interface ValueFormProps {
  value?: Value
  isNew?: boolean
  valuesArrayLength?: number
}

function ValueForm({ value, isNew = true, valuesArrayLength }: ValueFormProps) {


  const [title, setTitle] = useState<string>('')
  const [valueId, setValueId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()



  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Value')
  const headerTxt = useMemo(() => headerText(isNew, 'value', value?.title || ''), [isNew, value?.title])

  useEffect(() => {
    setTitle(value?.title || '')
    setDescription(value?.description || '')
    setSortOrder(value?.sortOrder || valuesArrayLength || 0)
    setValueId(value?.id || '')
  }, [valuesArrayLength, value])


  useEffect(() => {
    const isInputEmpty = !title || !description
    const isInputDifferent =
      title !== value?.title
      || description !== value?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, value,]);


  return (
    <div>
      <BasicFormAreaBG h2Text={headerTxt}  >

        <Form method='POST' className='p-8'>
          <div className="form-control  gap-y-6">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='rowId' value={valueId} hidden readOnly />

            <div>
              <InputLabelWithGuideLineLink
                inputTitle='Value'
                guideline={CoreValue}
                title='Values'
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
                title='Value Statement'
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

            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable || !isIdle}
              isNew={isNew}
              isShowCloseBtn={!isNew}
            />
          </div>

        </Form>
      </BasicFormAreaBG>
    </div>
  )
}

export default ValueForm