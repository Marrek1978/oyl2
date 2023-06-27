import { useEffect, useState } from 'react';
import { Form, Link, useActionData, useLocation, useMatches, useNavigation } from '@remix-run/react'

import { closeIcon, dbIcon, trashIcon } from '../utilities/icons'
import { Values } from '@prisma/client';
import SolidBtnGreyBlue from '../buttons/SolidBtnGreyBlue';

interface ValueFormProps {
  value?: Values
}


function ValueForm({ value }: ValueFormProps) {

  const matches = useMatches();
  const location = useLocation()
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [title, setTitle] = useState<string>('')
  const [valueId, setValueId] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [isAddNewValueRoute, setIsAddNewValueRoute] = useState(true) //true if /dash/values, false if /dash/values/:valueId

  const isSubmitting = navigation.state === 'submitting'
  const values = matches.find(match => match.id === 'routes/dash.values')?.data

  useEffect(() => {
    if (location.pathname === '/dash/values') {
      setIsAddNewValueRoute(true)
    } else if (location.pathname.startsWith('/dash/values/')) {
      setIsAddNewValueRoute(false)
    }
  }, [location.pathname]);

  useEffect(() => {
    setTitle(value?.valueTitle || '')
    setDescription(value?.valueDescription || '')
    setSortOrder(value?.sortOrder || values?.length)
    setValueId(value?.id || '')
  }, [values, value])


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
            {isAddNewValueRoute ? 'Create New Value' : (<div ><span className='text-sm' >Edit Value:</span>  {value?.valueTitle}</div>)}
          </div>
        </div>

        <Form method='post' className='mx-8'>
          <div className="form-control mt-6">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='valueId' value={valueId} hidden readOnly />
            <label className="label pl-0">
              <span className="label-text text-base font-mont font-semibold">Value Title</span>
            </label>
            <input type="text"
              placeholder="Enter a Value Title"
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
                placeholder="Describe what you value. You can describe why you value somethihng, but do not spend any time justifying your value."
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


          {/* //**************BUTTONS ***************  */}
          {isAddNewValueRoute
            ? (
              <button
                className="w-full btn btn-primary rounded-none mt-8  mb-8   "
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save New Value'} {dbIcon}
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
                      Delete Value
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

export default ValueForm