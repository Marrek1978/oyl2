import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { redirect } from '@remix-run/server-runtime';
import { Outlet, useNavigate, useParams, useRouteLoaderData } from '@remix-run/react';


import HeadingH1 from '~/components/titles/HeadingH1';
import SubHeading14px from '~/components/titles/SubHeading14px';
import SubHeading16px from '~/components/titles/SubHeading16px';
import BreadCrumbs from '~/components/breadCrumbTrail/BreadCrumbs';
import BasicTextAreaBG from '~/components/baseContainers/BasicTextAreaBG';
import H2WithLinkAndProsePara from '~/components/text/H2WithLinkAndProsePara';
import { varsForPluralText } from '~/components/dnds/desires/DndSortableDesire';
import AllOutcomesDisplay from '~/components/desires/outcomes/AllOutcomesDisplay';
import { transformCurrentDesireValueOutcomeDates } from '~/components/dnds/desires/DndDesires';
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
  const navigate = useNavigate();
  // const matches = useMatches();
  const loaderData = useRouteLoaderData('routes/dash.desires');
  if (!loaderData.desiresWithValuesOutcomes) redirect('/dash/desires')
  // const { desireOutcomes } = useLoaderData()
  const [desire, setDesire] = useState<DesireWithValuesAndOutcomes>();
  const [values, setValues] = useState<Value[]>([]);
  const [outcomes, setOutcomes] = useState<DesireOutcome[]>([]);


  // const desires: DesireWithValuesAndOutcomesWithStringDates[] = matches.find(match => match.id === 'routes/dash.desires')?.data.desiresWithValuesOutcomes

  useEffect(() => {
    const desiresWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates[] = loaderData?.desiresWithValuesOutcomes
    const currentDesireWithValuesOutcomesStrDates: DesireWithValuesAndOutcomesWithStringDates | undefined = desiresWithValuesOutcomesStrDates.find((desire: DesireWithValuesAndOutcomesWithStringDates) => desire.id === params.desireId)

    if (currentDesireWithValuesOutcomesStrDates !== undefined) {
      const currentDesire: DesireWithValuesAndOutcomes = transformCurrentDesireValueOutcomeDates(currentDesireWithValuesOutcomesStrDates)
      setDesire(currentDesire)
      const transformedDesireValues = currentDesire?.desireValues?.map(item => item.value) || [];
      setValues(transformedDesireValues);
      const transformedDesireOutcomes = currentDesire?.desireOutcomes || [];
      setOutcomes(transformedDesireOutcomes);
    } else {
      navigate("/dash/desires");
      return;
    }
  }, [loaderData, params, navigate])

  const { title, description, current, ideal } = desire || {};
  values?.sort((a, b) => a.sortOrder - b.sortOrder)
  const { plural: valueS, length: valuesLength } = varsForPluralText(values);
  const { plural: outcomeS } = varsForPluralText(outcomes);
  const hasValues = values?.length > 0;

  return (
    <>

      <BreadCrumbs title={title || ''} />
      <Outlet />

      <BasicTextAreaBG >
        <div className='text-success '>
          <SubHeading16px text='Desire' />
        </div>

        <article>

          {/* //?  THE TITLE SECTION  */}
          <div className='mt-4'>
            <HeadingH1 text={title || ''} />
          </div>

          <div className="flex flex-wrap gap-2 mt-2 max-w-prose text-secondary/70">
            <SubHeading14px
              text={`Serves the Value${valueS} of : `}
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
