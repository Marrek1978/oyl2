import { useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import HeadingH1 from '~/components/titles/HeadingH1';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex';
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading';
import { getDesireById, getDesireWithValuesAndOutcomes } from '~/models/desires.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import { ArrayOfObjectsStrToDates, ObjectStrToDates, varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Desire, Outcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';
import { requireUserId } from '~/models/session.server';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const { desireId } = params
  if (!desireId) return 'no Params Id'
  try {
    const desire = await getDesireById(desireId, userId);
    if (!desire) return 'noId'
    const desireWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
    if (!desireWithValuesOutcomes) return null
    return desireWithValuesOutcomes
  } catch (error) { throw error }
};


function DesirePage() {

  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  console.log("🚀 ~ file: dash.desires_.$desireId.tsx:40 ~ DesirePage ~ outcomes:", outcomes)
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | null>()
  const loadedDesire: DesireWithValuesAndOutcomes | null | undefined = useGetSpecificDesireWithValuesAndOutcomes();
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: loadedDesire, itemType: 'Desire' })


  useEffect(() => {
    if (loadedDesire === undefined || loadedDesire === null) return
    setDesire(loadedDesire)
  }, [loadedDesire])

  useEffect(() => {
    const extractedValuesArrayFromValuesObjArray = desire?.desireValues?.map((value: any) => value.value) || [];
    setValues(extractedValuesArrayFromValuesObjArray);
    const extractedOutcomes = desire?.outcomes || [];
    const sortedOutcomes = extractedOutcomes.sort((a, b) => a.sortOrder - b.sortOrder)
    setOutcomes(sortedOutcomes);
  }, [desire])

  const { title, description, current, ideal } = desire || {};
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const { plural: outcomeS } = varsForPluralText(outcomes);


  const valueTitles = values?.map((value) => value.title)
  return (
    <>

      <BreadCrumbs secondCrumb={desire?.title || 'Desire'} />
      <Outlet />
      {warning && (
        <Modal zIndex={50}>
          {alertMessage}
        </Modal>
      )}

      <BasicTextAreaBG pageTitle='Desire'>
        <article>
          {/* //?  THE TITLE SECTION  */}
          <div className='mt-2 ml-[-2px]'>
            <HeadingH1 H1Title={title || ''} />
          </div>

          <div className="flex flex-wrap gap-2 mt-1  text-base-content/50">
            <TwoToneSubHeading
              staticHeading='Serves the Value'
              variableHeadingsArray={valueTitles}
              size='14px'
            />
          </div>



          <ThreeParaFlex
            title1={'The Desire'}
            linkDestination1={'editDetails'}
            linkText1={'Edit Desire Description'}
            textParagraph1={description || ''}

            title2={'The Current Situation'}
            linkDestination2={'editCurrent'}
            linkText2={'Edit Current Situation'}
            textParagraph2={current?.length ? current : DesireCurrentDefaultText}

            title3={'The Ideal Scenario'}
            linkDestination3={'editIdeal'}
            linkText3={'Edit Ideal Scenario'}
            textParagraph3={ideal?.length ? ideal : DesireIdealPlaceholderText}
          />

          {/* //?  OUTCOMES  */}
          <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max  mt-12 '>
            <AllOutcomesDisplay
              outcomes={outcomes}
              plural={outcomeS}
              title={title || ''}
            />
          </div>

        </article>
      </BasicTextAreaBG >
    </>
  )
}

export default DesirePage



export const useGetLoaderData = (path: string = `routes/dash.desires_.$desireId`): DesireWithValuesAndOutcomesWithStringDates | null | undefined => {
  const loaderData = useRouteLoaderData(path)
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomesWithStringDates | null | undefined>(undefined)

  useEffect(() => {
    if (loaderData === undefined) return
    if (loaderData === 'noId' || loaderData === null) return setDesire(null)
    const desireWithStrDates = loaderData as DesireWithValuesAndOutcomesWithStringDates
    setDesire(desireWithStrDates)
  }, [loaderData])

  return desire
}

export const useGetSpecificDesireWithValuesAndOutcomes = (path: string = `routes/dash.desires_.$desireId`): DesireWithValuesAndOutcomes | null | undefined => {
  const loadedData = useGetLoaderData(path)
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | null | undefined>()

  useEffect(() => {
    if (loadedData === undefined) return
    if (!loadedData || loadedData === null) return setDesire(null)
    const data = loadedData as DesireWithValuesAndOutcomesWithStringDates
    const { desireValues, outcomes, ...desire } = data
    let desireWithProperDates: Desire
    let outcomesWithProperDates: Outcome[] = []
    let desireValuesWithProperDates: { value: Value }[] = []

    desireWithProperDates = ObjectStrToDates({ item: desire, dateKeys: ['createdAt', 'updatedAt'] })
    if (outcomes.length > 0) {
      outcomesWithProperDates = ArrayOfObjectsStrToDates({ items: outcomes, dateKeys: ['createdAt', 'updatedAt'] })
    }
    if (desireValues.length > 0) {
      desireValuesWithProperDates = desireValues.map((value) => {
        const valueWithProperDates = ObjectStrToDates({ item: value.value, dateKeys: ['createdAt', 'updatedAt'] })
        return {
          ...value,
          value: valueWithProperDates,
        }
      })
    }

    const objWithProperDates = {
      ...desireWithProperDates,
      desireValues: desireValuesWithProperDates,
      outcomes: outcomesWithProperDates
    }
    setDesire(objWithProperDates)
  }, [loadedData])

  return desire
}


