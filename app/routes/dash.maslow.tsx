import { parse } from 'querystring';
import { Outlet } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node';

import { MaslowsNeeds } from '~/utils/MaslowsNeeds';
import HeadingH1 from '~/components/headers/HeadingH1'
import { requireUserId } from '~/models/session.server';
import MaslowDisplay from '~/components/displays/maslow/MaslowDisplay';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG'

import type { MaslowCategory, MaslowCriteria, MaslowsNeedsType } from '~/types/maslowTypes';
import { createDesire } from '~/models/desires.server';

function CreateDesireObj(id: string) {
  const criteriaId = parseInt(id)
  let criteriaIndex = 0
  let specificNeedCriteria: MaslowCriteria = {} as MaslowCriteria

  MaslowsNeeds.forEach((need: MaslowsNeedsType) => {
    need.categories.forEach((category: MaslowCategory) => {
      category.criteria.forEach((criteria: MaslowCriteria) => {
        criteriaIndex++
        if (criteriaIndex === criteriaId) {
          console.log("🚀 ~ CreateDesireObj ~ criteria:", criteria)
          specificNeedCriteria = criteria as MaslowCriteria
        }
      })
    })
  })


  let desire = {
    title: specificNeedCriteria.title,
    description: specificNeedCriteria.description,
    // userId,
    sortOrder: 0,
    // valueIds,
  }

  return desire
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formBody = await request.text();
  const parsedBody = parse(formBody);
  console.log("🚀 ~ action ~ parsedBody:", parsedBody)

  if (request.method === 'DELETE') {
    return 'deleted'
  }

  if (request.method === 'POST') {
    const userId = await requireUserId(request)
    const maslowId = parsedBody.MaslowCriteriaId as string

    if (!maslowId) return 'failed'
    const desireObj = CreateDesireObj(maslowId)

    let desire = {
      title: desireObj.title,
      description: desireObj.description,
      userId,
      sortOrder: 0,
      maslowOrder: parseInt(maslowId),
      valueIds: [],
    }

    try {
      await createDesire(desire)
      return 'success'
    } catch (error) { return 'failed' }

  }


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
  return 'failed'
}


//! ******************** edit desires to load in maslow order... then Dnd---- figure out strategy.... just do on save?  or load?  or both? ********************


function MaslowPage() {

  // const fetcher = useFetcher();
  // const [isUpdating, setIsUpdating] = useState(false)
  // const [errorMessage, setErrorMessage] = useState<string>()
  // const [isChecked, setIsChecked] = useState(false)


  return (
    <>
      <Outlet />
      <div className='max-w-max'>
        <BasicTextAreaBG pageTitle="Needs">
          <div className='mt-2 ml-[-2px]'>
            <HeadingH1 H1Title={"Maslow's Hierarch of Needs"} />
          </div>
          <div className="flex flex-col gap-y-8   ">
            {/* {NeedsCategoriesFormAndInputs()} */}
            <MaslowDisplay />
          </div>
        </BasicTextAreaBG >
      </div>
    </>
  )
}

export default MaslowPage



