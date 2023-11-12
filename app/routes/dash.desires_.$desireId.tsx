import { useEffect, useState } from 'react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import HeadingH1 from '~/components/titles/HeadingH1';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import ThreeParaFlex from '~/components/baseContainers/ThreeParaFlex';
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading';
import { getDesireWithValuesAndOutcomes } from '~/models/desires.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import { ArrayOfObjectsStrToDates, ObjectStrToDates, varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Desire, Outcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { desireId } = params
  if (!desireId) throw new Error('No desireId in params')
  try {
    const desireWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
    return desireWithValuesOutcomes
  } catch (error) { throw error }
};


function DesirePage() {

  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | undefined | null>()
  const loadedDesire: DesireWithValuesAndOutcomes | null = useGetSpecificDesireWithValuesAndOutcomes();

  useEffect(() => {
    if (loadedDesire === null) return setDesire(null)
    setDesire(loadedDesire)
  }, [loadedDesire])

  useEffect(() => {
    const extractedValuesArrayFromValuesObjArray = desire?.desireValues?.map((value: any) => value.value) || [];
    setValues(extractedValuesArrayFromValuesObjArray);
    const extractedOutcomes = desire?.outcomes || [];
    setOutcomes(extractedOutcomes);
  }, [desire])

  const { title, description, current, ideal } = desire || {};
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const { plural: outcomeS } = varsForPluralText(outcomes);
  const { warning, alertMessage } = useInvalidItemIdAlertAndRedirect({ loaderData: desire, itemType: 'Desire' })

  const valueTitles = values?.map((value) => value.title)
  return (
    <>

      <BreadCrumbs secondCrumb={'Desire'} />
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
            <HeadingH1 text={title || ''} />
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
            textParagraph2={'Edit Current Situation'}
            linkText2={current?.length ? current : DesireCurrentDefaultText}
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


const path: string = `routes/dash.desires_.$desireId`

export const useGetLoaderData = (): DesireWithValuesAndOutcomesWithStringDates | null => {
  const loaderData = useRouteLoaderData(path)
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomesWithStringDates | null>(null)

  useEffect(() => {
    if (loaderData === undefined || loaderData === null) return setDesire(null)
    const desireWithStrDates = loaderData as DesireWithValuesAndOutcomesWithStringDates
    setDesire(desireWithStrDates)
  }, [loaderData])

  return desire
}

export const useGetSpecificDesireWithValuesAndOutcomes = (): DesireWithValuesAndOutcomes => {
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>()
  const loadedData = useGetLoaderData()

  useEffect(() => {
    if (loadedData === undefined || loadedData === null) return
    const data = loadedData as DesireWithValuesAndOutcomesWithStringDates
    // console.log("🚀 ~ file: dash.desires_.$desireId.tsx:174 ~ useEffect ~ data:", data)
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

  return desire || {} as DesireWithValuesAndOutcomes
}


