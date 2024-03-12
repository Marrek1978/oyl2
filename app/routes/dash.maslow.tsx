import { Form, Outlet, useFetcher } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node';
import React, { useEffect, useState } from 'react'
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara'
import HeadingH1 from '~/components/titles/HeadingH1'
// import HeadingH2 from '~/components/titles/HeadingH2'
// import HeadingH3 from '~/components/titles/HeadingH3'
import HeadingH4 from '~/components/titles/HeadingH4'
import SubHeading14px from '~/components/titles/SubHeading14px'

import { MaslowsNeeds, type MaslowsNeedsType } from '~/utils/MaslowsNeeds'
import useFetcherState from '~/components/utilities/useFetcherState';


export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formBody = await request.text();
  console.log("🚀 ~ action ~ formBody:", formBody)
  //   const userId = await requireUserId(request);
  //   const { desireId } = params
  //   if (!desireId) return 'no Params Id'
  //   try {
  //     const desire = await getDesireById(desireId, userId);
  //     if (!desire) return 'noId'
  //     const desireWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
  //     if (!desireWithValuesOutcomes) return null
  //     return desireWithValuesOutcomes
  //   } catch (error) { throw error }
  // };
  return 'success'
}



const maslowsNeeds: MaslowsNeedsType[] = MaslowsNeeds

function MaslowPage() {

  const fetcher = useFetcher();
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isChecked, setIsChecked] = useState(false)

  const { fetcherState, fetcherMessage } = useFetcherState({ fetcher })


  let categoryNum = 0;

  useEffect(() => {
    if (fetcherMessage === 'success' && fetcherState === 'idle') {
      setIsUpdating(false)
      // setIsDisableAllBtns(false);
    }

    if (fetcherMessage === 'failed' && fetcherState === 'idle') {
      setIsUpdating(false)
      // setIsDisableAllBtns(false);
      setErrorMessage('Failed to update task  status')
      setTimeout(() => setErrorMessage(''), 1000);
    }
  }, [fetcherMessage, fetcherState])

  const NeedsCategoriesFormAndInputs = (): React.ReactNode => {
    return maslowsNeeds.map((need, index) => {
      const needHeader = H2WithLinkAndProsePara({ title: need.needName, paragraph: need.description })
      const categoriesAndInputs = CategoriesAndInputs(need.categories)

      return (
        <div key={index}>
          {needHeader}
          {categoriesAndInputs}
        </div>
      )
    })
  }


  const CategoriesAndInputs = (array: MaslowsNeedsType['categories']): React.ReactNode => {
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
            {checkBoxInputs(category.criteria)}
          </Form>
        </div>
      )
    })
  }


  const checkBoxInputs = (array: string[]): React.ReactNode => {
    return array.map((criterion, index) => {

      categoryNum++

      return (
        <div key={index} className="flex gap-x-4 items-center justify-between">
          <label className="label pl-0 max-w-prose" htmlFor="checkbox" >
            <span className="label-text " >{criterion}</span>
          </label>

          <div className={`flex gap-x-12 max-w-max px-4 hover:cursor-pointer`}  >
            <div className='label mr-6'>
              <input
                type="checkbox"
                id={`${categoryNum}`}
                className="checkbox checkbox-error self-center "
                onChange={handleCheckboxChange}
              />

            </div>
          </div>
        </div >
      )
    })
  }

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {


    // post or delete based on clicking/unclicking
    // post => create new desire, order basede on CriteriaId order

    // delete => delete desire, reorder based on CriteriaId
    console.log(event.currentTarget.id)
    console.log('clicked')
    setIsUpdating(true); // Start progress bar
    // setIsDisableAllBtns(true);
    const complete = event.target.checked;
    const completeString = JSON.stringify(complete)
    try {
      fetcher.submit({
       criteriaId: event.currentTarget.id,
        completeString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
  }


  return (
    <>
      <Outlet />
      <div className='max-w-max'>
        <BasicTextAreaBG pageTitle="Needs">
          <div className='mt-2 ml-[-2px]'>
            <HeadingH1 H1Title={"Maslow's Hierarch of Needs"} />
          </div>

          <div className="flex flex-col gap-y-8 mt-8 ">
            {NeedsCategoriesFormAndInputs()}
          </div>
        </BasicTextAreaBG >
      </div>
    </>
  )





}

export default MaslowPage



