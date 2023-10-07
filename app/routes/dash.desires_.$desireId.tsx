import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { Outlet, useRouteLoaderData } from '@remix-run/react';

import HeadingH1 from '~/components/titles/HeadingH1';
import SubHeading14px from '~/components/titles/SubHeading14px';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import { getDesireWithValuesAndOutcomes } from '~/models/desires.server';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';
import { ArrayOfObjectsStrToDates, ObjectStrToDates, varsForPluralText } from '~/components/utilities/helperFunctions';

import type { Desire, Outcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';


export const loader = async ({ request, params }: LoaderArgs) => {
  const { desireId } = params
  if (!desireId) throw new Error('No desireId in params')
  try {
    const desiresWithValuesOutcomes = await getDesireWithValuesAndOutcomes(desireId);
    return desiresWithValuesOutcomes
  } catch (error) { throw error }
};


function DesirePage() {

  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  const desire: any = useGetSpecificDesireWithValuesAndOutcomes();


  useEffect(() => {
    const extractedValuesArrayFromValuesObjArray = desire?.desireValues?.map((value: any) => value.value) || [];
    setValues(extractedValuesArrayFromValuesObjArray);
    const extractedOutcomes = desire?.outcomes || [];
    setOutcomes(extractedOutcomes);
  }, [desire])

  const { title, description, current, ideal } = desire || {};
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const hasValues = values?.length > 0;
  const { plural: valueS, length: valuesLength } = varsForPluralText(values);
  const { plural: outcomeS } = varsForPluralText(outcomes);

  return (
    <>

      <BreadCrumbs secondCrumb={'Desire'} />
      <Outlet />

      <BasicTextAreaBG pageTitle='Desire'>
        <article>
          {/* //?  THE TITLE SECTION  */}
          <div className='mt-2 ml-[-2px]'>
            <HeadingH1 text={title || ''} />
          </div>

          <div className="flex flex-wrap gap-2 mt-1  text-base-content/50">
            <SubHeading14px
              text={`Serves the Value${valueS} of : `}
            />
            {hasValues && (
              <div className='flex flex-wrap gap-x-2 font-semibold text-secondary/70'>
                {values?.map((value, index) => {
                  const title = value.title
                  let id = uuidv4();
                  let placeComma = index < valuesLength - 1 ? ', ' : ''

                  return (
                    <div key={id}>
                      <SubHeading14px text={`${title}${placeComma}`} />
                    </div>
                  )
                })}
              </ div>
            )}
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


export const useGetLoaderData = (): DesireWithValuesAndOutcomesWithStringDates | undefined => {
  const path = `routes/dash.desires_.$desireId`
  const loaderData = useRouteLoaderData(path)
  const [desiresWithStrDates, setDesiresWithStrDates] = useState<DesireWithValuesAndOutcomesWithStringDates>()

  useEffect(() => {
    if (!loaderData) return
    const desiresWithValuesAndOutcomesStrDates = loaderData
    if (desiresWithValuesAndOutcomesStrDates) setDesiresWithStrDates(desiresWithValuesAndOutcomesStrDates)
  }, [loaderData])

  return desiresWithStrDates
}


export const useGetSpecificDesireWithValuesAndOutcomes = () => {
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes | undefined>()
  const desiresWithStrDates: DesireWithValuesAndOutcomesWithStringDates | undefined = useGetLoaderData()

  useEffect(() => {
    if (!desiresWithStrDates) return
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