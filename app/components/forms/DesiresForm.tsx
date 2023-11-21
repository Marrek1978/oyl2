import { Form } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react'

import FormButtons from './FormButtons';
import BasicFormAreaBG from './BasicFormAreaBG';
import CheckboxWithLabel from './CheckboxWithLabel';
import { headerText, useSaveBtnText } from './FormsCommonFunctions';
import useGetNavigationState from '../utilities/useNavigationState';
import InputLabelWithGuideLineLink from './InputLabelWithGuideLineLink';
import { DesireDescription, DesireTitle, DesireValuesServed } from '../utilities/Guidelines';

import type { Value } from '@prisma/client';
import { isObjInObjArrayById, type NumTimesValueServedType } from '~/routes/dash.desires';
import type { DesireWithValues, DesireWithValuesAndOutcomes } from '~/types/desireTypes';

interface DesireFormProps {
  desire?: DesireWithValues | DesireWithValuesAndOutcomes
  isNew?: boolean
  nextSortOrder?: number
  allUserValues?: Value[] | undefined
  unservedValues?: Value[] | undefined
  numTimesValueServed?: NumTimesValueServedType[]
}

function DesiresForm({ desire, isNew = true, nextSortOrder, allUserValues, unservedValues, numTimesValueServed }: DesireFormProps) {
  const [title, setTitle] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [loadedValues, setLoadedValues] = useState<Value[]>([])
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const { isIdle } = useGetNavigationState()

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Desire')
  const headerTxt = useMemo(() => headerText(isNew, 'Desire', desire?.title || ''), [isNew, desire?.title])


  useEffect(() => {
    setTitle(desire?.title || '')
    setDescription(desire?.description || '')
    setSortOrder(nextSortOrder || 0)
    setDesireId(desire?.id || '')
    const LoadedDesireValues = desire?.desireValues.map((dv: any) => dv.value.title)
    setLoadedValues(LoadedDesireValues || [])
    LoadedDesireValues
      ? setCheckedValues(LoadedDesireValues?.map(dv => dv))
      : setCheckedValues([])
  }, [desire, nextSortOrder])


  useEffect(() => {
    const isInputEmpty = !title || !description || (checkedValues.length === 0)
    const isInputDifferent =
      title !== desire?.title
      || description !== desire?.description
      || (!isNew && !arraysEqual(loadedValues, checkedValues))
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, desire?.title, desire?.description, isNew, loadedValues, checkedValues]);


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
      <div className=' '>
        <BasicFormAreaBG h2Text={headerTxt} >
          <Form method='post' className='p-8'>
            <div className="form-control gap-y-6">
              <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
              <input type="string" name='rowId' value={desireId} hidden readOnly />

              <div>
                <InputLabelWithGuideLineLink
                  inputTitle='Desire'
                  guideline={DesireTitle}
                  guideLineTitle='Desire'
                />
                <input type="text"
                  placeholder="Enter a Desire Title"
                  name='title'
                  className='input-field-text-title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className=' '>
                <InputLabelWithGuideLineLink
                  inputTitle='Description'
                  guideline={DesireDescription}
                  guideLineTitle='Desire Statement'
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
              </div>


              {/* //**************VALUES CHECKBOXES ***************  */}

              <div  >
                <InputLabelWithGuideLineLink
                  inputTitle='Values Served (Choose at least 1) '
                  guideline={DesireValuesServed}
                />
                {allUserValues?.map((value: Value) => {
                  const isUnServed = isObjInObjArrayById(value, unservedValues || [])
                  const numTimesThisValueServed = numTimesValueServed?.find(obj => obj.hasOwnProperty(value.title))  || undefined
                  return (
                    <div key={value.id} className='mt-2'>
                      <CheckboxWithLabel
                        id={value.id}
                        label={value.title}
                        checkedValues={checkedValues}
                        handleCheckboxChange={handleCheckboxChange}
                        notYetUsed={isUnServed}
                        numTimesValueServed={numTimesThisValueServed}
                      />
                    </div>
                  )
                })}
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
      </div>
    </>
  )
}

export default DesiresForm



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
