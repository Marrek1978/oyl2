import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { redirect } from '@remix-run/server-runtime';
import { Outlet, useParams, useRouteLoaderData } from '@remix-run/react';


import HeadingH1 from '~/components/titles/HeadingH1';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import { varsForPluralText } from '~/components/dnds/desires/DndSortableDesire';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import { transformDesireValueOutcomeDates } from '~/components/dnds/desires/DndDesires';
import { DesireCurrentDefaultText, DesireIdealPlaceholderText } from '~/components/utilities/PlaceHolderTexts';

import type { DesireOutcome, Value } from '@prisma/client';
import type { DesireWithValuesAndOutcomes, DesireWithValuesAndOutcomesWithStringDates } from '~/types/desireTypes';
// export const loader = async ({ request, params }: LoaderArgs) => {
//   const desireId = params.desireId!
//   try {
//     const desireOutcomes = await getOutcomesByDesireId(desireId)
//     return { desireOutcomes };
//   } catch (error) { throw error }
// }


function DesirePage() {

  const params = useParams();
  // const matches = useMatches();
  const loaderData = useRouteLoaderData('routes/dash.desires');
  // const { desireOutcomes } = useLoaderData()
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>();
  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<DesireOutcome[]>([]);


  // const desires: DesireWithValuesAndOutcomesWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desiresWithValuesOutcomes

  useEffect(() => {

    if (!loaderData.desiresWithValuesOutcomes) redirect('/dash/desires')
    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes
    const desiresWithValuesOutcomesProperDates: DesireWithValuesAndOutcomes[] = transformDesireValueOutcomeDates(desiresWithValuesOutcomesStrDates)
    const currentDesire: DesireWithValuesAndOutcomes | undefined = desiresWithValuesOutcomesProperDates?.find((desire: DesireWithValuesAndOutcomes) => desire.id === params.desireId)
    // const desire: DesireWithValues | undefined = desires.find((desire: Desire) => desire.id === params.desireId)
    // const isSequentialOrder:boolean = isDesireInSequentialOrder(desiresWithValuesOutcomesProperDates)
    !currentDesire && redirect('/dash/desires')
    setDesire(currentDesire)
    console.log('currentDesire is ', currentDesire)
    const transformedDesireValues = currentDesire?.desireValues?.map(item => item.value) || [];
    console.log('transformedDesireValues is ', transformedDesireValues)

    setValues(transformedDesireValues);
    // setDesireValues(currentDesire?.desireValues || [])

  }, [loaderData, params])




  // const desireValues: DesireValues['desireValues'] = desire?.desireValues || []
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const { title, description, current, ideal } = desire || {};
  const plural = values && values.length > 1 ? 's' : '';

  // const outcomes = desireOutcomes?.map((outcome: DesireOutcome) => {
  //   return {
  //     ...outcome,
  //     createdAt: new Date(outcome.createdAt),
  //     updatedAt: new Date(outcome.updatedAt),
  //   }
  // })

  const { plural: valueS, length: valuesLength } = varsForPluralText(values);


  const hasValues = values?.length > 0;
  // const hasOutcomes = desireOutcomes?.length > 0

  return (
    <>

      <BreadCrumbs title={title || ''} />
      <Outlet />

      <BasicTextAreaBG >
        <div className='text-success '>
          <SubHeading16px text='Desire' />
        </div>

        <div className='mt-8'>
          <HeadingH1 text={title || ''} />
        </div>


        {/* //?  THE TITLE SECTION  */}
        <section id='DesireAndCurrentSituation'>
          <div className='flex-1 w-full'>

            <div className=" flex flex-wrap gap-2 mt-2 max-w-prose text-secondary/70">
              <SubHeading14px
                text={`Serves the Value${plural} of : `}
              />
              {hasValues && (
                <div className='flex flex-wrap gap-x-2 font-semibold'>
                  {values?.map((value, index) => {
                    const title = value.valueTitle
                    let id = uuidv4();
                    let placeComma = index < valuesLength - 1 ? ', ' : ''

                    return (
                      <div key={id}>
                        <SubHeading14px text={`${title}${placeComma}`} />
                      </div>
                    )
                  })}
                </ div>
              )
              }
            </div >


            <div className='flex flex-wrap gap-12 max-w-max mt-8'>

              {/* //*  Grouped together  */}
              {/* //?  THE DESIRE  */}
              <div className=' flex-1  min-w-[400px]'>
                <H2WithLinkAndProsePara
                  title={'The Desire'}
                  linkDestination={'editDetails'}
                  linkText={'Edit Desire Description'}
                  paragraph={description || ''}
                />
              </div>

              {/* //?  THE CURRENT SITUATION  */}
              <div className='flex-1 min-w-[400px]'>
                <H2WithLinkAndProsePara
                  title={'Current Situation'}
                  linkDestination={'editCurrent'}
                  linkText={'Edit Current Situation'}
                  paragraph={current?.length ? current : DesireCurrentDefaultText}
                />
              </div>



            </div>
          </div>
        </section>


        <section id='IdealAndOutcomes'>

          <div className='flex gap-8 flex-wrap'>
            <div className='flex-1'>
              {/* //?  THE IDEAL SITUATION  */}
              <div className='flex-1 min-w-[400px]'>
                <H2WithLinkAndProsePara
                  title={'The Ideal Scenario'}
                  linkDestination={'editIdeal'}
                  linkText={'Edit Ideal Scenario'}
                  paragraph={ideal?.length ? ideal : DesireIdealPlaceholderText}
                />
              </div>
            </div>
            <div className='flex-1'>
              <AllOutcomesDisplay
                outcomes={outcomes}
                plural={plural}
                title={title || ''}
              />
            </div>

          </div>
        </section>
        {/* </div> */}
      </BasicTextAreaBG >

    </>
  )
}

export default DesirePage
