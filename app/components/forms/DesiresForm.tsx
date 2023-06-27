import React, { useEffect, useState } from 'react'
import { Form, Link, useActionData, useLocation, useMatches, useNavigation } from '@remix-run/react';

import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';
import { closeIcon, dbIcon, trashIcon } from '../utilities/icons';

import type { Desires, Values } from '@prisma/client'
import { DesireValues } from '@prisma/client';
import { DesireWithValues } from '~/types/desireTypes';


interface DesireFormProps {
  desire?: DesireWithValues
}

//! *************  get checkboxes clearing ... in chat gpt
//! *************  make sortable

function DesiresForm({ desire }: DesireFormProps) {

  const matches = useMatches();
  const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [desireId, setDesireId] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new desire, set to desires.length
  const [isAddNewDesireRoute, setIsAddNewDesireRoute] = useState<boolean>(true) //true if /dash/desires, false if /dash/desires/:desireId
  const [desireValues, setDesireValues] = useState<Values[]>([])
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const isSubmitting = navigation.state === 'submitting'
  const desires = matches.find(match => match.id === 'routes/dash.desires')?.data.desires
  const allUserValues = matches.find(match => match.id === 'routes/dash.desires')?.data.values

  useEffect(() => {
    if (location.pathname === '/dash/desires') {
      setIsAddNewDesireRoute(true)
    } else if (location.pathname.startsWith('/dash/desires/')) {
      setIsAddNewDesireRoute(false)
    }
  }, [location.pathname]);


  useEffect(() => {
    setTitle(desire?.title || '')
    setDescription(desire?.description || '')
    setSortOrder(desire?.sortOrder || desires?.length)
    setDesireId(desire?.id || '')

    const desireValuesOnly = desire?.desireValues.map((dv) => dv.value)
    setDesireValues(desireValuesOnly || [])
  }, [desires, desire])

  useEffect(() => {
    if (desireValues) {
      setCheckedValues(desireValues.map(dv => dv.valueTitle));
    }
  }, [desireValues]);

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
      <div className='
          bg-base-100 
          grid grid-cols-[minmax(300px,800px)] grid-rows-[72px_1fr_min-content]
          cursor-default
        '>
        <div className='w-full h-full px-8 bg-base-content flex justify-between items-center'>
          <div className={`
              text-xl font-mont uppercase font-normal tracking-widest 
              text-primary-300
              truncate overflow-ellipsis 
              `}>
            {isAddNewDesireRoute ? 'Create New Desire' : (<div ><span className='text-sm' >Edit Desire:</span>  {title}</div>)}
          </div>
        </div>

        <Form method='post' className='mx-8'>
          <div className="form-control mt-6">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='desireId' value={desireId} hidden readOnly />
            <label className="label pl-0">
              <span className="label-text text-base font-mont font-semibold">Desire Title</span>
            </label>
            <input type="text"
              placeholder="Enter a Desire Title"
              name='title'
              className="
                input border-none input-secondary 
                bg-base-200 rounded-none
                font-poppins font-normal tracking-wide
                "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {validationErrors?.title && (
              <div className='text-red-700'> {validationErrors.title}</div>
            )}

            <div className='mt-6'>
              <label className="label pl-0">
                <span className="label-text text-base font-mont font-semibold">Description</span>
              </label>
              <textarea
                className="w-full 
                  textarea textarea-bordered h-24 
                  input border-none input-secondary 
                  bg-base-200 rounded-none
                  font-poppins font-normal  leading-snug
                  "
                placeholder="Describe what you desire. You can describe why you desire somethihng, but do not spend any time justifying your desire."
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              >
              </textarea>
              {validationErrors?.description && (
                <div className='text-red-700'> {validationErrors.description}</div>
              )}
            </div>
          </div>


          {/* //**************VALUES CHECKBOXES ***************  */}

          <div className='mt-6'>
            <label className="label pl-0">
              <span className="label-text text-base font-mont font-semibold">Values Served</span>
            </label>

            <div className="grid grid-cols-[minmax(0,_max-content)_min-content] gap-x-6 ">
              {allUserValues?.map((value: Values) => (
                <React.Fragment key={value.id}>
                  <div className="mr-12" >
                    <label className="cursor-pointer label">
                      <span className="label-text">{value.valueTitle}</span>
                    </label>
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
          {isAddNewDesireRoute
            ? (
              <button
                className="w-full btn btn-primary rounded-none mt-8  mb-8   "
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Edits'} {dbIcon}
              </button>
            ) : (<>

              <div className='mt-6'>
                <button
                  className="btn btn-primary rounded-none w-full   "
                  type='submit'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Edits'} {dbIcon}
                </button>
              </div>

              <div className='w-full flex gap-4 mt-6 mb-8'>
                <div className='flex-1'>
                  <Link to='delete' >
                    <button className='btn btn-error btn-outline  
                    w-full
                    rounded-none
                    font-mont font-semibold
                  ' >
                      Delete Desire
                      {trashIcon}
                    </button>
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

        </Form>
      </div>
    </>
  )
}

export default DesiresForm
