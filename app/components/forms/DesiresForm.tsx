import React, { useEffect, useState } from 'react'
import { Form, Link, useActionData, useLocation, useMatches, useNavigation } from '@remix-run/react';

import ListLabel from './ListLabel';
import InputLabel from './InputLabel';
import SolidBtn from '../buttons/SolidBtn';
import BasicFormAreaBG from './BasicFormAreaBG';
import OutlinedBtn from '../buttons/OutlinedBtn';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';

import type { Desire, Value } from '@prisma/client'
import type { DesireWithValues } from '~/types/desireTypes';


interface DesireFormProps {
  desire?: DesireWithValues
}

function DesiresForm({ desire }: DesireFormProps) {

  const matches = useMatches();
  const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [desireValues, setDesireValues] = useState<Value[]>([])
  const [checkedValues, setCheckedValues] = useState<string[]>([]);
  const [isAddNewDesireRoute, setIsAddNewDesireRoute] = useState<boolean>(true)
  const [saveBtnText, setSaveBtnText] = useState<string>('Save Desire')

  const isSubmitting = navigation.state === 'submitting'
  const desires: Desire[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const allUserValues: Value[] = matches.find(match => match.id === 'routes/dash.desires')?.data.allUserValues

  useEffect(() => {
    if (location.pathname === '/dash/desires') {
      setIsAddNewDesireRoute(true)
      setSaveBtnText('Create Desire')
      // setIsSaveable(true)
    } else if (location.pathname.startsWith('/dash/desires/')) {
      setIsAddNewDesireRoute(false)
      setSaveBtnText('Save Edits to Desire')
    }
  }, [location.pathname]);


  
  useEffect(() => {
    setTitle(desire?.title || '')
    setDescription(desire?.description || '')
    setSortOrder(desire?.sortOrder || desires?.length || 0)
    setDesireId(desire?.id || '')
    const desireValuesOnly = desire?.desireValues.map((dv: any) => dv.value.valueTitle)
    setDesireValues(desireValuesOnly || [])
    desireValuesOnly && setCheckedValues(desireValuesOnly?.map(dv => dv));
  }, [desires, desire])


  useEffect(() => {
    const isInputEmpty = !title || !description
    const isInputDifferent =
      title !== desire?.title
      || description !== desire?.description
      || (!isAddNewDesireRoute && !arraysEqual(desireValues, checkedValues))
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, desire?.title, desire?.description, isAddNewDesireRoute, desireValues, checkedValues]);


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
      <BasicFormAreaBG
        title={isAddNewDesireRoute
          ? 'Create New Desire'
          : (<div ><span className='text-sm' >Edit Desire: </span>{title}</div>)
        }
      >
        <Form method='post' className='mx-8'>
          <div className="form-control vert-space-between-inputs">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='desireId' value={desireId} hidden readOnly />

            <InputLabel text='Desire Title' />
            <input type="text"
              placeholder="Enter a Desire Title"
              name='title'
              className='input-field-text-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {validationErrors?.title && (
              <div className='validation-error'> {validationErrors.title}</div>
            )}

            <div className='vert-space-between-inputs'>
              <InputLabel text='Description' />
              <textarea
                className='input-field-text-para '
                placeholder="Describe what you desire. You can describe why you desire somethihng, but do not spend any time justifying your desire."
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              >
              </textarea>
              {validationErrors?.description && (
                <div className='validation-error'> {validationErrors.description}</div>
              )}
            </div>
          </div>


          {/* //**************VALUES CHECKBOXES ***************  */}

          <div className='vert-space-between-inputs'>
            <InputLabel text='Values Served' />
            <div className="list-grid">
              {allUserValues?.map((value: Value) => (
                <React.Fragment key={value.id}>
                  <div className="" >
                    <ListLabel text={value.valueTitle} />
                  </div>
                  <div className='label'>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary self-center "
                      name={`value-${value.id}`}
                      checked={checkedValues.includes(value.valueTitle)}
                      onChange={() => handleCheckboxChange(value.valueTitle)}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6 mb-8'>
            <SolidBtn text={isSubmitting ? 'Saving...' : saveBtnText}
              onClickFunction={() => { }}
              icon={dbIcon}
              disableSaveBtn={isSubmitting || !isSaveable}
            />

            {!isAddNewDesireRoute &&
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
