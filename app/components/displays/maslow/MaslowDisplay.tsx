import React, { useEffect, useState } from 'react'
import { MaslowsNeeds } from '~/utils/MaslowsNeeds'
import { Form, useFetcher } from '@remix-run/react'

import useServerMessages from '../modals/useServerMessages'
import useFetcherState from '~/components/utilities/useFetcherState'
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara'
import useFormDeletedToastAndRedirect from '~/components/utilities/useFormDeletedToast'

import type { MaslowCategory, MaslowsNeedsType } from '~/types/maslowTypes'
import MaslowCheckBoxInput from './MaslowCheckBoxInput'
import HeadingH4 from '~/components/headers/HeadingH4'
import SubHeading14px from '~/components/headers/SubHeading14px'


function MaslowDisplay() {

  const fetcher = useFetcher();
  const [isAllDisabled, setIsAllDisabled] = useState(false)
  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher })

  useServerMessages({ fetcherState: fetcherState, fetcherMessage: fetcherMessage, isShowSuccess: true, isShowFailed: true, successMessage: 'Need was saved to Needs/Desires list.' })
  useFormDeletedToastAndRedirect({ message: 'Need was deleted from Needs/Desires list.', fetcherMessage })

  let needNumber = 0;
  const maslowsNeeds: MaslowsNeedsType[] = MaslowsNeeds

  useEffect(() => {
    setIsAllDisabled(fetcherState !== 'idle')
  }, [fetcherState])

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isNeedNotMet = event.target.checked;
    const isSaveNeed = JSON.stringify(isNeedNotMet)
    const MaslowCriteriaId = event.currentTarget.id

    if (event.target.checked === true) {
      try {
        fetcher.submit({
          MaslowCriteriaId,
          isSaveNeed
        }, {
          method: 'POST',
        })
      } catch (error) { throw error }
    } else if (event.target.checked === false) {
      try {
        fetcher.submit({
          MaslowCriteriaId,
          isSaveNeed
        }, {
          method: 'DELETE',
        })
      } catch (error) { throw error }
    }
  }


  const NeedsCategoriesFormAndInputs = (maslowsNeeds: MaslowsNeedsType[]): React.ReactNode => {
    return maslowsNeeds.map((need, index) => {
      const needHeader = H2WithLinkAndProsePara({ title: need.needName, paragraph: need.description })
      const categoriesAndInputs = CategoriesAndInputs(need.categories)

      return (
        <div key={index}>
          <div className='mt-8'>
            {needHeader}
          </div>
          {categoriesAndInputs}
        </div>
      )
    })
  }


  const CategoriesAndInputs = (array: MaslowCategory[]): React.ReactNode => {
    return array.map((category, index) => {
      return (
        <div key={index} className='mt-4 ml-4'>
          <div className='flex gap-4 items-center justify-between'>
            <HeadingH4 text={category.categoryName} />
            <div className='flex gap-4'>
              <div className='max-w-[80px] text-center'>
                {(category.categoryName === 'Air') &&
                  <div className='text-error' >
                    <SubHeading14px text={'Need is NOT Met'} />
                  </div>
                }
              </div>
            </div>
          </div>
          <Form className="space-y-1 ml-4 form-control w-full  font-mont">
            {category.criteria.map((critera, index) => {
              needNumber++
              return (
                <MaslowCheckBoxInput
                  key={index}
                  criteria={critera}
                  needNumber={needNumber}
                  isAllDisabled={isAllDisabled}
                  handleCheckboxChange={handleCheckboxChange}
                />
              )
            })}
          </Form>
        </div>
      )
    })
  }




  const needsCategoriesFormAndInputs = NeedsCategoriesFormAndInputs(maslowsNeeds)

  return (
    <>
      <div>{needsCategoriesFormAndInputs}</div>
    </>
  )
}

export default MaslowDisplay