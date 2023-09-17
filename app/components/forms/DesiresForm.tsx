import { useEffect, useState } from 'react'
import { Form, Link, useActionData, useMatches, useNavigation } from '@remix-run/react';

import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import CheckboxWithLabel from './CheckboxWithLabel';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireDescription, DesireTitle, DesireValuesServed } from '../utilities/Guidelines';

import type { DesireWithValues, DesireWithValuesAndOutcomes } from '~/types/desireTypes';
import type { ValueWithStringDates } from '~/types/valueTypes';
import { useGetAllDesiresWithValuesAndOutcomes } from '~/routes/dash.desires';

interface DesireFormProps {
  desire?: DesireWithValues
  isNew?: boolean
}

function DesiresForm({ desire, isNew = true }: DesireFormProps) {

  const matches = useMatches();
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [loadedValues, setLoadedValues] = useState<ValueWithStringDates[]>([])
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const isSubmitting = navigation.state === 'submitting'
  const isIdle = navigation.state === 'idle'
  // const desires: DesireWithValuesWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const allUserValues: ValueWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires')?.data.allUserValues
  const desires: DesireWithValuesAndOutcomes[] | undefined = useGetAllDesiresWithValuesAndOutcomes();

  const maxDesiresSortOrder = Math.max(...desires?.map(desire => desire.sortOrder) || [0]);
  const nextSortOrder = isNew ? maxDesiresSortOrder + 1 : sortOrder;

  const saveBtnText =
    isSubmitting
      ? 'Saving...'
      : isNew
        ? "Save New Desire"
        : "Save Changes to Desire"

  const header = isNew
    ? 'Create New Desire'
    : (<>
      <div>
        <span className='text-sm' >
          Edit Desire:
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
    setTitle(desire?.title || '')
    setDescription(desire?.description || '')
    setSortOrder(nextSortOrder || 0)
    setDesireId(desire?.id || '')
    const LoadedDesireValues = desire?.desireValues.map((dv: any) => dv.value.valueTitle)
    setLoadedValues(LoadedDesireValues || [])
    LoadedDesireValues && setCheckedValues(LoadedDesireValues?.map(dv => dv));
  }, [desire, nextSortOrder])


  useEffect(() => {
    const isInputEmpty = !title || !description || (checkedValues.length === 0)
    const isInputDifferent =
      title !== desire?.title
      || description !== desire?.description
      || (!isNew && !arraysEqual(loadedValues, checkedValues))
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, desire?.title, desire?.description, isNew, loadedValues, checkedValues]);


  function arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const sortedA = a.slice().sort();
    const sortedB = b.slice().sort();

    for (let i = 0; i < sortedA.length; ++i) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  }

  const handleCheckboxChange = (valueTitle: string) => {
    setCheckedValues(prevCheckedValues => {
      if (prevCheckedValues.includes(valueTitle)) {
        return prevCheckedValues.filter(title => title !== valueTitle);
      } else {
        return [...prevCheckedValues, valueTitle];
      }
    });
  }


  return (
    <>
      <BasicFormAreaBG title={header} >
        <Form method='post' className='mx-8'>
          <div className="form-control vert-space-between-inputs">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='desireId' value={desireId} hidden readOnly />

            <InputLabelWithGuideLineLink
              text='Desire'
              guideline={DesireTitle}
              title='Desires'
            />
            <input type="text"
              placeholder="Enter a Desire Title"
              name='title'
              className='input-field-text-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {TitleError}

            <div className='vert-space-between-inputs'>
              <InputLabelWithGuideLineLink
                text='Description'
                guideline={DesireDescription}
                title='Desire Description'
              />
              <textarea
                className='input-field-text-para '
                placeholder="Describe what you desire. You can describe why you desire somethihng, but do not spend any time justifying your desire."
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              >
              </textarea>
              {DescriptionError}
            </div>
          </div>


          {/* //**************VALUES CHECKBOXES ***************  */}

          <div className='vert-space-between-inputs'>
            <InputLabelWithGuideLineLink
              text='Values Served (Choose at least 1) '
              guideline={DesireValuesServed}
              title='Values Served'
            />
            {allUserValues?.map((value: ValueWithStringDates) => (
              <CheckboxWithLabel
                key={value.id}
                id={value.id}
                label={value.valueTitle}
                checkedValues={checkedValues}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6 mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : saveBtnText}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableBtn={!isIdle || !isSaveable}
            />

            {!isNew &&
              (<>
                <div className='two-button-spacing mt-6 mb-8'>
                  <div className='flex-1'>
                    <Link to='delete' >
                      <OutlinedBtn
                        text='Delete Desire'
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
    </>
  )
}

export default DesiresForm
