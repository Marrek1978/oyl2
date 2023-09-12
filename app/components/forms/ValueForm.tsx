import { useState, useEffect } from 'react';
import { Form, Link, useActionData, useMatches, useNavigation } from '@remix-run/react'

import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons'

import type { Value } from '@prisma/client';
import SolidBtn from '../buttons/SolidBtn';
import OutlinedBtn from '../buttons/OutlinedBtn';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { CoreValue, CoreValueStatement } from '../utilities/Guidelines';
import BasicFormAreaBG from './BasicFormAreaBG';

interface ValueFormProps {
  value?: Value
  isNew?: boolean
}

function ValueForm({ value, isNew = true }: ValueFormProps) {

  const matches = useMatches();
  // const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [valueId, setValueId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const isSubmitting = navigation.state === 'submitting'
  const isIdle = navigation.state === 'idle'
  const values = matches.find(match => match.id === 'routes/dash.values')?.data

  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNew
        ? "Save New Value"
        : "Save Changes to Value"

  const header = isNew
    ? 'Create New Value'
    : (<>
      <div>
        <span className='text-sm' >
          Edit Value:
        </span>
      </div>
      <div>
        {title}
      </div>
    </>)

  const TitleError = validationErrors?.title && (
    <div className='validation-error'> {validationErrors.title}</div>)

  const DescriptionError = validationErrors?.description && (
    <div className='validation-error'> {validationErrors.description}</div>)


  useEffect(() => {
    setTitle(value?.valueTitle || '')
    setDescription(value?.valueDescription || '')
    setSortOrder(value?.sortOrder || values?.length)
    setValueId(value?.id || '')
  }, [values, value])


  useEffect(() => {
    const isInputEmpty = !title || !description
    const isInputDifferent =
      title !== value?.valueTitle
      || description !== value?.valueDescription
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, value,]);


  return (
    <div>
      <BasicFormAreaBG title={header}  >

        <Form method='post' className='mx-8'>
          <div className="form-control vert-space-between-inputs">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='valueId' value={valueId} hidden readOnly />

            <InputLabelWithGuideLineLink
              text='Value'
              guideline={CoreValue}
              title='Values'
            />
            <input type="text"
              placeholder="Enter a Value Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // required
            />
            {TitleError}

            <div className='vert-space-between-inputs'>
              <InputLabelWithGuideLineLink
                text='Value Statement'
                guideline={CoreValueStatement}
                title='Value Statement'
              />
              <textarea
                className="input-field-text-para "
                placeholder="Describe what you value. You can describe why you value somethihng, but do not spend any time justifying your value."
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // required
              >
              </textarea>
              {DescriptionError}
            </div>
          </div>


          {/* //**************BUTTONS ***************  */}
          <div className='vert-space-between-inputs mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : saveBtnText}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableBtn={!isSaveable || !isIdle}
            />

            {!isNew &&
              (<>
                <div className='two-button-spacing vert-space-between-inputs mb-8'>
                  <div className='flex-1'>
                    <Link to='delete' >
                      <OutlinedBtn
                        text='Delete Value'
                        onClickFunction={() => { }}
                        icon={trashIcon}
                        daisyUIBtnColor='error'
                      />
                    </Link>
                  </div>

                  <div className='flex-1'>
                    <Link to='..' >
                      <SolidBtnGreyBlue text='Close w/o saving'
                        onClickFunction={() => { }}
                        icon={closeIcon}
                      />
                    </Link>
                  </div>
                </div>
              </>)}
          </div>
        </Form>
      </BasicFormAreaBG>
    </div>
  )
}

export default ValueForm