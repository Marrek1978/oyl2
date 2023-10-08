import { useEffect, useState } from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';

import Modal from '~/components/modals/Modal';
import HeadingH1 from '~/components/titles/HeadingH1';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import TwoToneSubHeading from '~/components/titles/TwoToneSubHeading';
import { getDesireWithValuesAndOutcomes } from '~/models/desires.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import useInvalidItemIdAlertAndRedirect from '~/components/modals/InvalidItemIdAlertAndRedirect';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import { ArrayOfObjectsStrToDates, ObjectStrToDates, varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Desire, Outcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';


export const loader = async ({ request, params }: LoaderArgs) => {
  const { desireId } = params
  if (!desireId) throw new Error('No desireId in params')
  try {
    const desiresWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
    return desiresWithValuesOutcomes || null
  } catch (error) { throw error }
};


function DesirePage() {

  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | undefined | null>()
  const loadedDesire: DesireWithValuesAndOutcomes | undefined | null = useGetSpecificDesireWithValuesAndOutcomes();

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


          {/* //?  PARAGRAPHS  */}
          <div className='flex flex-wrap gap-12 mt-8'>

            {/* //?  THE DESIRE  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max '>
              <H2WithLinkAndProsePara
                title={'The Desire'}
                linkDestination={'editDetails'}
                linkText={'Edit Desire Description'}
                paragraph={description || ''}
              />
            </div>

            {/* //?  THE CURRENT SITUATION  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
              <H2WithLinkAndProsePara
                title={'The Current Situation'}
                linkDestination={'editCurrent'}
                linkText={'Edit Current Situation'}
                paragraph={current?.length ? current : DesireCurrentDefaultText}
              />
            </div>

            {/* //?  THE IDEAL SITUATION  */}
            <div className='flex-1 min-w-[350px] sm:min-w-[550px] max-w-max   '>
              <H2WithLinkAndProsePara
                title={'The Ideal Scenario'}
                linkDestination={'editIdeal'}
                linkText={'Edit Ideal Scenario'}
                paragraph={ideal?.length ? ideal : DesireIdealPlaceholderText}
              />
            </div>

          </div>
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


interface getLoaderDataProps {
  path?: string | undefined;
}



export const useGetLoaderData = ({ path = `routes/dash.desires_.$desireId` }: getLoaderDataProps): DesireWithValuesAndOutcomesWithStringDates | undefined | null => {
  const loaderData = useRouteLoaderData(path)
  const [desiresWithStrDates, setDesiresWithStrDates] = useState<DesireWithValuesAndOutcomesWithStringDates | null>()

  useEffect(() => {
    if (loaderData === undefined) return
    if (loaderData === null) return setDesiresWithStrDates(null)
    const desiresWithValuesAndOutcomesStrDates = loaderData
    if (desiresWithValuesAndOutcomesStrDates) setDesiresWithStrDates(desiresWithValuesAndOutcomesStrDates)
  }, [loaderData])

  return desiresWithStrDates
}

export const useGetSpecificDesireWithValuesAndOutcomes = ({ path = `routes/dash.desires_.$desireId` } = {} as getLoaderDataProps): DesireWithValuesAndOutcomes | undefined | null => {
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | undefined | null>()
  const desiresWithStrDates: DesireWithValuesAndOutcomesWithStringDates | undefined | null = useGetLoaderData({ path })
  useEffect(() => {
    if (desiresWithStrDates === undefined) return
    if (desiresWithStrDates === null) return setDesire(null)
    const { desireValues, outcomes, ...desire } = desiresWithStrDates
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
  }, [desiresWithStrDates])

  return desire
}


